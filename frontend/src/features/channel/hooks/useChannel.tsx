import { useNavigate } from "react-router-dom";
import { useToast } from "../../../hooks/useToast";
import { useChannelEmitters } from "../websocket/emitters/channel";

export function useChannel() {
  const { emitCreateChannel } = useChannelEmitters();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  async function createChannel() {
    try {
      const { channelId, message } = await emitCreateChannel();

      toastSuccess(message);
      navigate(`/channel/${channelId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toastError(error.message);
      }
    }
  }

  return { createChannel };
}
