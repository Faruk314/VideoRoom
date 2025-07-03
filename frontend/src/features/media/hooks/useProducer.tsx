import type { Transport } from "mediasoup-client/types";
import { useMedia } from "./useMedia";
import { useParticipantStore } from "../../channel/store/participant";

export default function useProducer() {
  const { getMediaStream } = useMedia();
  const { updateLocalParticipant, localParticipant } = useParticipantStore();

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

      updateLocalParticipant({
        producers: [...localParticipant!.producers, newProducer],
        streams: [...localParticipant!.streams, stream],
      });
    } catch {
      throw new Error("Error creating video producer");
    }
  }

  return { createVideoProducer };
}
