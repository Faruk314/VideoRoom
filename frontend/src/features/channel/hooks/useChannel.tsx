import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../hooks/useToast";
import { useChannelEmitters } from "../websocket/emitters/channel";
import { useLocalParticipantStore } from "../store/localParticipant";
import type { MediaKind } from "../../media/types/media";
import { useProducerStore } from "../../media/store/producers";

export function useChannel() {
  const { id } = useParams<{ id: string }>();
  const { toastError } = useToast();
  const navigate = useNavigate();
  const { emitJoinChannel, emitLeaveChannel } = useChannelEmitters();
  const { removeLocalParticipant, removeStream } = useLocalParticipantStore();
  const { producers, removeProducer } = useProducerStore();

  async function joinChannel(channelId: string) {
    try {
      await emitJoinChannel({
        channelId,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toastError(error.message);
        navigate("/home");
      }
      throw new Error("Channel join failed");
    }
  }

  async function leaveChannel() {
    const localParticipant =
      useLocalParticipantStore.getState().localParticipant;

    if (!localParticipant)
      return console.error(
        "Local participant does not exist. Failed to leave channel"
      );

    Object.entries(localParticipant.streams ?? {}).forEach(([kind, stream]) => {
      stream?.getTracks().forEach((track) => track.stop());
      removeStream(kind as MediaKind);
    });

    Object.entries(producers ?? {}).forEach(([kind, producer]) => {
      producer?.close();
      removeProducer(kind as MediaKind);
    });

    removeLocalParticipant();

    try {
      if (!id) throw new Error("Channel id missing. Failed to leave channel");

      await emitLeaveChannel({ channelId: id });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) throw new Error(error.message);
    } finally {
      navigate("/home");
    }
  }

  return { joinChannel, leaveChannel };
}
