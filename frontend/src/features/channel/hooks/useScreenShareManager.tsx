import useProducer from "../../media/hooks/useProducer";
import { useMediasoupStore } from "../../media/store/mediasoup";
import useChannelManager from "./useChannelManager";
import { useMedia } from "../../media/hooks/useMedia";
import { useLocalParticipantStore } from "../store/localParticipant";

export default function useScreenShareManager() {
  const { addStream } = useLocalParticipantStore.getState();
  const { createDisplayProducer } = useProducer();
  const { sendTransport } = useMediasoupStore();
  const { stopStream } = useChannelManager();
  const { getDisplayStream } = useMedia();

  async function toogleScreenShare() {
    const { localParticipant } = useLocalParticipantStore.getState();

    const displayProducer = localParticipant?.producers.screen;

    if (!displayProducer) {
      if (!sendTransport) throw new Error("Send transport missing");

      const screenTrack = await createDisplayProducer(sendTransport);

      if (!screenTrack) return;

      screenTrack.onended = async () => {
        await stopStream("screen");
      };

      return;
    }

    await stopStream("screen");
  }

  async function switchScreenShare() {
    const { localParticipant } = useLocalParticipantStore.getState();

    if (!localParticipant?.producers.screen) return;

    const currentScreenProducer = localParticipant.producers.screen;
    const currentScreenStream = localParticipant.streams.screen;

    try {
      const { stream: newStream, screenTrack: newScreenTrack } =
        await getDisplayStream();

      await currentScreenProducer.replaceTrack({ track: newScreenTrack });

      const oldVideoTrack = currentScreenStream?.getVideoTracks()[0];

      oldVideoTrack?.stop();

      addStream("screen", newStream);

      newScreenTrack.onended = async () => {
        await stopStream("screen");
      };
    } catch (error) {
      console.error("Error switching screen share source", error);
    }
  }

  return { toogleScreenShare, switchScreenShare };
}
