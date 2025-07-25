import { useSocket } from "../../../../hooks/useSocket";
import { useSocketEvent } from "../../../../hooks/useSocketEvent";
import { useChannelHandlers } from "../handlers/channel";

export function useChannelEvents() {
  const { socket } = useSocket();
  const {
    onParticipantJoin,
    onParticipantLeave,
    onParticipantSpeak,
    onParticipantSilence,
  } = useChannelHandlers();

  useSocketEvent(socket, "participantJoined", onParticipantJoin);

  useSocketEvent(socket, "participantLeft", onParticipantLeave);

  useSocketEvent(socket, "participantSpeaking", onParticipantSpeak);

  useSocketEvent(socket, "participantSilence", onParticipantSilence);
}
