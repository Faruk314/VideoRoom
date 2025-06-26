import { useQuery } from "@tanstack/react-query";
import { getErrorMessage } from "../../../lib/error";
import { getChannel } from "../api/channel";
import { useChannelStore } from "../store/channel";

export function useChannelQuery(channelId: string) {
  const { setParticipants } = useChannelStore();

  return useQuery({
    queryKey: ["channel", channelId],
    enabled: !!channelId,
    queryFn: async () => {
      try {
        const data = await getChannel(channelId);

        setParticipants(data.participants);

        return data;
      } catch (error) {
        console.error(getErrorMessage(error));
        return [];
      }
    },
  });
}
