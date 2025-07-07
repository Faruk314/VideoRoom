import type { Transport } from "mediasoup-client/types";
import { useMedia } from "./useMedia";
import { useLocalParticipantStore } from "../../channel/store/localParticipant";

export default function useProducer() {
  const { getMediaStream } = useMedia();
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

  return { createVideoProducer };
}
