import { useLocalParticipantStore } from "../store/localParticipant";
import { useMediaStore } from "../../media/store/media";
import useProducer from "../../media/hooks/useProducer";
import { useMediasoupStore } from "../../media/store/mediasoup";
import useChannelManager from "./useChannelManager";
import { useMedia } from "../../media/hooks/useMedia";
import { useProducerStore } from "../../media/store/producers";

export default function useVideoManager() {
  const { localParticipant, addStream } = useLocalParticipantStore.getState();
  const { setSelectedCamera } = useMediaStore();
  const { createVideoProducer } = useProducer();
  const { producers } = useProducerStore();
  const { sendTransport } = useMediasoupStore();
  const { stopStream } = useChannelManager();
  const { getMediaStream } = useMedia();

  async function toogleCamera() {
    const videoProducer = producers.video;

    if (!videoProducer) {
      if (!sendTransport) throw new Error("Send transport missing");

      return await createVideoProducer(sendTransport);
    }

    await stopStream("video");
  }

  async function switchCamera(device: MediaDeviceInfo) {
    setSelectedCamera(device);

    const currentVideoProducer = producers.video;

    if (!currentVideoProducer)
      return console.error("Video producer does not exist");

    const currentVideoStream = localParticipant?.streams.video;

    try {
      const { stream: newStream, videoTrack: newVideoTrack } =
        await getMediaStream(device.deviceId);

      await currentVideoProducer.replaceTrack({ track: newVideoTrack });

      const oldVideoTrack = currentVideoStream?.getVideoTracks()[0];
      oldVideoTrack?.stop();

      addStream("video", newStream);

      newVideoTrack.onended = async () => {
        await stopStream("video");
      };
    } catch (error) {
      console.error("Error switching video producer stream", error);
    }
  }

  return { toogleCamera, switchCamera };
}
