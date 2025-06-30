import { useSocket } from "../../../../hooks/useSocket";
import { useSocketEvent } from "../../../../hooks/useSocketEvent";
import { useChannelHandlers } from "../handlers/channel";

export function useChannelEvents() {
  const { socket } = useSocket();
  const { onParticipantJoin } = useChannelHandlers();

  useSocketEvent(socket, "participantJoined", onParticipantJoin);
}
