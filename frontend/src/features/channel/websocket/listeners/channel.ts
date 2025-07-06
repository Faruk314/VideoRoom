import { useSocket } from "../../../../hooks/useSocket";
import { useSocketEvent } from "../../../../hooks/useSocketEvent";
import { useChannelHandlers } from "../handlers/channel";

export function useChannelEvents() {
  const { socket } = useSocket();
  const { onParticipantJoin, onParticipantLeave } = useChannelHandlers();

  useSocketEvent(socket, "participantJoined", onParticipantJoin);

  useSocketEvent(socket, "participantLeft", onParticipantLeave);
}
