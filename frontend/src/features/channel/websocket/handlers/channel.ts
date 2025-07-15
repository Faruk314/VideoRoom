import { useCallback } from "react";
import type { IParticipant } from "../../types/channel";
import { useParticipantStore } from "../../store/remoteParticipant";
import { useLocalParticipantStore } from "../../store/localParticipant";

export function useChannelHandlers() {
  const {
    addParticipant,
    getParticipant,
    removeParticipant,
    updateParticipant,
  } = useParticipantStore();

  const { updateLocalParticipant } = useLocalParticipantStore();

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
    const { localParticipant } = useLocalParticipantStore.getState();

    if (localParticipant?.user.userId === userId) {
      return updateLocalParticipant({ isSpeaking: true });
    }

    updateParticipant(userId, { isSpeaking: true });
  }, []);

  const onParticipantSilence = useCallback((data: { userId: string }) => {
    const { userId } = data;
    const { localParticipant } = useLocalParticipantStore.getState();

    if (localParticipant?.user.userId === userId) {
      return updateLocalParticipant({ isSpeaking: false });
    }

    updateParticipant(userId, { isSpeaking: false });
  }, []);

  return {
    onParticipantJoin,
    onParticipantLeave,
    onParticipantSpeak,
    onParticipantSilence,
  };
}
