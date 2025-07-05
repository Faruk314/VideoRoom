import { useQuery } from "@tanstack/react-query";
import { getErrorMessage } from "../../../lib/error";
import { getChannel } from "../api/channel";
import { useParticipantStore } from "../store/remoteParticipant";
import { useUserStore } from "../../user/store/user";
import type { IParticipant } from "../types/channel";
import { useLocalParticipantStore } from "../store/localParticipant";

export function useChannelQuery(channelId: string) {
  const { setParticipants } = useParticipantStore();
  const { setLocalParticipant } = useLocalParticipantStore();
  const { user: localUser } = useUserStore();

  return useQuery({
    queryKey: ["channel", channelId],
    enabled: !!channelId,
    queryFn: async () => {
      try {
        const { participants }: { participants: IParticipant[] } =
          await getChannel(channelId);

        const others = participants.filter(
          (p) => p.user.userId !== localUser?.userId
        );
        setParticipants(others);

        const self = participants.find(
          (p) => p.user.userId === localUser?.userId
        );

        if (self) {
          setLocalParticipant({ ...self, producers: {}, streams: {} });
        }

        return participants;
      } catch (error) {
        console.error(getErrorMessage(error));
        return [];
      }
    },
  });
}
