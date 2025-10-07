import { useCallback } from "react";
import type { IParticipant } from "../../types/channel";
import { useParticipantStore } from "../../store/remoteParticipant";
import { useChannelStore } from "../../store/channel";

export function useChannelHandlers() {
  const { addParticipant, getParticipant, removeParticipant } =
    useParticipantStore();

  const onParticipantJoin = useCallback(
    async (data: { participant: IParticipant }) => {
      const { participant } = data;

      addParticipant({ ...participant });
    },
    []
  );

  const onParticipantLeave = useCallback((data: { userId: string }) => {
    const { userId } = data;

    const participant = getParticipant(userId);

    if (!participant) return console.error("Participant does not exist");

    Object.values(participant.consumers ?? {}).forEach((consumer) => {
      consumer?.close();
    });

    removeParticipant(userId);
  }, []);

  const onParticipantSpeak = useCallback((data: { userId: string }) => {
    const { userId } = data;
    useChannelStore.getState().setSpeaking(userId, true);
  }, []);

  const onParticipantSilence = useCallback((data: { userId: string }) => {
    const { userId } = data;
    useChannelStore.getState().setSpeaking(userId, false);
  }, []);

  return {
    onParticipantJoin,
    onParticipantLeave,
    onParticipantSpeak,
    onParticipantSilence,
  };
}
