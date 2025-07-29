import { useMedia } from "../../media/hooks/useMedia";
import useProducer from "../../media/hooks/useProducer";
import { useMediaStore } from "../../media/store/media";
import { useMediasoupStore } from "../../media/store/mediasoup";
import { useLocalParticipantStore } from "../store/localParticipant";
import useChannelManager from "./useChannelManager";

export default function useAudioManager() {
  const { localParticipant, addStream } = useLocalParticipantStore.getState();
  const { getAudioStream } = useMedia();
  const { setSelectedMic } = useMediaStore();
  const { sendTransport } = useMediasoupStore();
  const { createAudioProducer } = useProducer();
  const { stopStream } = useChannelManager();

  async function toogleMicrophone() {
    const { localParticipant } = useLocalParticipantStore.getState();

    const audioProducer = localParticipant?.producers.audio;

    if (!audioProducer) {
      if (!sendTransport) throw new Error("Send transport missing");

      return await createAudioProducer(sendTransport);
    }

    await stopStream("audio");
  }

  async function switchMicrophone(device: MediaDeviceInfo) {
    setSelectedMic(device);

    if (!localParticipant?.producers.audio) return;

    const currentAudioProducer = localParticipant.producers.audio;
    const currentAudioStream = localParticipant.streams.audio;

    try {
      const { stream: newStream, audioTrack: newAudioTrack } =
        await getAudioStream(device.deviceId);

      await currentAudioProducer.replaceTrack({ track: newAudioTrack });

      const oldAudioTrack = currentAudioStream?.getAudioTracks()[0];

      oldAudioTrack?.stop();

      addStream("audio", newStream);

      newAudioTrack.onended = async () => {
        await stopStream("audio");
      };
    } catch (error) {
      console.error("Error switching audio producer stream", error);
    }
  }

  return { switchMicrophone, toogleMicrophone };
}
