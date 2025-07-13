import type { Transport } from "mediasoup-client/types";
import { useMedia } from "./useMedia";
import { useLocalParticipantStore } from "../../channel/store/localParticipant";

export default function useProducer() {
  const { getMediaStream, getDisplayStream } = useMedia();
  const { addProducer, addStream, updateLocalParticipant } =
    useLocalParticipantStore();

  async function createVideoProducer(clientSendTransport: Transport) {
    try {
      const { stream, videoTrack } = await getMediaStream();

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
      addProducer("video", newProducer);
      updateLocalParticipant({ camMuted: false });
    } catch (error) {
      console.error(error);
      throw new Error("Error creating video producer");
    }
  }

  async function createAudioProducer(clientSendTransport: Transport) {
    try {
      const { stream, audioTrack } = await getMediaStream();

      const newProducer = await clientSendTransport.produce({
        track: audioTrack,
        appData: { streamType: "audio" },
      });

      addStream("audio", stream);
      addProducer("audio", newProducer);

      updateLocalParticipant({ micMuted: false });
    } catch (error) {
      console.error(error);
      throw new Error("Error creating video producer");
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
      addProducer("screen", newProducer);
      updateLocalParticipant({ isStreaming: true });
    } catch (error) {
      console.error(error);
      throw new Error("Error creating display producer");
    }
  }

  return { createVideoProducer, createAudioProducer, createDisplayProducer };
}
