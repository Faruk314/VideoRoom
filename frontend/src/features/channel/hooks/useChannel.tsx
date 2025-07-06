import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../hooks/useToast";
import { useChannelEmitters } from "../websocket/emitters/channel";
import { useLocalParticipantStore } from "../store/localParticipant";
import type { MediaKind } from "../../media/types/media";

export function useChannel() {
  const { id } = useParams<{ id: string }>();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();
  const { emitCreateChannel } = useChannelEmitters();
  const { emitJoinChannel, emitLeaveChannel } = useChannelEmitters();
  const { removeStream, removeProducer } = useLocalParticipantStore();
  const { removeLocalParticipant } = useLocalParticipantStore();

  async function createChannel() {
    try {
      const { channelId, message } = await emitCreateChannel();

      toastSuccess(message);
      navigate(`/channel/${channelId}`);
    } catch (error: unknown) {
      if (error instanceof Error) toastError(error.message);
    }
  }

  async function joinChannel(input: string) {
    try {
      const { channelId, message } = await emitJoinChannel({
        channelId: input,
      });

      toastSuccess(message);

      navigate(`/channel/${channelId}`);
    } catch (error: unknown) {
      if (error instanceof Error) toastError(error.message);
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

    Object.entries(localParticipant.producers ?? {}).forEach(
      ([kind, producer]) => {
        producer?.close();
        removeProducer(kind as MediaKind);
      }
    );

    removeLocalParticipant();

    try {
      if (!id) throw new Error("Channel id missing. Failed to leave channel");

      const { message } = await emitLeaveChannel({ channelId: id });

      console.log(message);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) throw new Error(error.message);
    } finally {
      navigate("/home");
    }
  }

  return { createChannel, joinChannel, leaveChannel };
}
