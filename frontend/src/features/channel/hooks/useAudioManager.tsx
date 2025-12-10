import { useMedia } from "../../media/hooks/useMedia";
import useProducer from "../../media/hooks/useProducer";
import { useMediaStore } from "../../media/store/media";
import { useMediasoupStore } from "../../media/store/mediasoup";
import { useProducerStore } from "../../media/store/producers";
import { useLocalParticipantStore } from "../store/localParticipant";
import useChannelManager from "./useChannelManager";

export default function useAudioManager() {
  const { localParticipant, addStream } = useLocalParticipantStore.getState();
  const { producers } = useProducerStore();
  const { getAudioStream } = useMedia();
  const { setSelectedMic } = useMediaStore();
  const { sendTransport } = useMediasoupStore();
  const { createAudioProducer } = useProducer();
  const { stopStream } = useChannelManager();

  async function toogleMicrophone() {
    const audioProducer = producers.audio;

    if (!audioProducer) {
      if (!sendTransport) throw new Error("Send transport missing");

      return await createAudioProducer(sendTransport);
    }

    await stopStream("audio");
  }

  async function switchMicrophone(device: MediaDeviceInfo) {
    setSelectedMic(device);

    if (!producers) return;

    const currentAudioProducer = producers.audio;

    if (!currentAudioProducer)
      return console.error("Audio producer does not exist");

    const currentAudioStream = localParticipant?.streams.audio;

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
