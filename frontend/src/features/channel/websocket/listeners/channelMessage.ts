import { useSocket } from "../../../../hooks/useSocket";
import { useSocketEvent } from "../../../../hooks/useSocketEvent";
import { useChannelMessageHandlers } from "../handlers/channelMessage";

export function useChannelMessageEvents() {
  const { socket } = useSocket();
  const { onChannelMessage } = useChannelMessageHandlers();

  useSocketEvent(socket, "newChannelMessage", onChannelMessage);
}
