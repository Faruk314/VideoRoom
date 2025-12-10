import type { Transport } from "mediasoup-client/types";
import { useMedia } from "./useMedia";
import { useMediaStore } from "../store/media";
import { useProducerStore } from "../store/producers";
import { useLocalParticipantStore } from "../../channel/store/localParticipant";

export default function useProducer() {
  const { getMediaStream, getAudioStream, getDisplayStream } = useMedia();
  const { updateLocalParticipant, addStream } = useLocalParticipantStore();
  const { setProducer } = useProducerStore();

  async function createVideoProducer(clientSendTransport: Transport) {
    const { selectedCamera } = useMediaStore.getState();

    try {
      const { stream, videoTrack } = await getMediaStream(
        selectedCamera?.deviceId
      );

      const newProducer = await clientSendTransport.produce({
        track: videoTrack,
        appData: { streamType: "video" },
        encodings: [
          { rid: "r0", maxBitrate: 100_000, scaleResolutionDownBy: 4 },
          { rid: "r1", maxBitrate: 300_000, scaleResolutionDownBy: 2 },
          { rid: "r2", maxBitrate: 900_000, scaleResolutionDownBy: 1 },
        ],
      });

      addStream("video", stream);
      setProducer("video", newProducer);
      updateLocalParticipant({ camMuted: false });

      return videoTrack;
    } catch (error) {
      console.error("Error creating video producer", error);
    }
  }

  async function createAudioProducer(clientSendTransport: Transport) {
    const { selectedMic } = useMediaStore.getState();

    try {
      const { stream, audioTrack } = await getAudioStream(
        selectedMic?.deviceId
      );

      const newProducer = await clientSendTransport.produce({
        track: audioTrack,
        appData: { streamType: "audio" },
      });

      addStream("audio", stream);
      setProducer("audio", newProducer);
      updateLocalParticipant({ micMuted: false });

      return audioTrack;
    } catch (error) {
      console.error("Error creating audio producer", error);
    }
  }

  async function createDisplayProducer(clientSendTransport: Transport) {
    try {
      const { stream, screenTrack } = await getDisplayStream();

      const newProducer = await clientSendTransport.produce({
        track: screenTrack,
        appData: { streamType: "screen" },
      });

      addStream("screen", stream);
      setProducer("screen", newProducer);
      updateLocalParticipant({ isStreaming: true });

      return screenTrack;
    } catch (error) {
      console.error("Error creating display producer", error);
    }
  }

  return { createVideoProducer, createAudioProducer, createDisplayProducer };
}
