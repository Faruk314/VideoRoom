import { useQuery } from "@tanstack/react-query";
import { getErrorMessage } from "../../../lib/error";
import { getChannel } from "../api/channel";
import { useParticipantStore } from "../store/participant";
import { useUserStore } from "../../user/store/user";
import type { IParticipant } from "../types/channel";

export function useChannelQuery(channelId: string) {
  const { setParticipants } = useParticipantStore();
  const { user: localUser } = useUserStore();

  return useQuery({
    queryKey: ["channel", channelId],
    enabled: !!channelId,
    queryFn: async () => {
      try {
        const data: { participants: IParticipant[] } = await getChannel(
          channelId
        );

        const sortedParticipants: IParticipant[] = Array.from(
          data.participants.values()
        ).sort((a, b) => {
          if (a.user.userId === localUser?.userId) return -1;
          if (b.user.userId === localUser?.userId) return 1;
          return 0;
        });

        setParticipants(sortedParticipants);

        return data;
      } catch (error) {
        console.error(getErrorMessage(error));
        return [];
      }
    },
  });
}
