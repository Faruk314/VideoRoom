import { useCallback } from "react";
import type { IParticipant } from "../../types/channel";
import { useParticipantStore } from "../../store/participant";

export function useChannelHandlers() {
  const { addParticipant } = useParticipantStore();

  const onParticipantJoin = useCallback(
    async (data: { participant: IParticipant }) => {
      const { participant } = data;

      addParticipant({ ...participant, consumers: [] });
    },
    []
  );

  return {
    onParticipantJoin,
  };
}
