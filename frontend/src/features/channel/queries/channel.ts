import { useMutation, useQuery } from "@tanstack/react-query";
import { getErrorMessage } from "../../../lib/error";
import { createChannel, getChannel } from "../api/channel";
import { useParticipantStore } from "../store/remoteParticipant";
import { useUserStore } from "../../user/store/user";
import type { IParticipant } from "../types/channel";
import { useLocalParticipantStore } from "../store/localParticipant";
import { useChannelStore } from "../store/channel";
import { useToast } from "../../../hooks/useToast";
import { useNavigate } from "react-router-dom";

function useChannelQuery(channelId: string, isJoined: boolean) {
  const { setChannel } = useChannelStore();
  const { setParticipants } = useParticipantStore();
  const { setLocalParticipant } = useLocalParticipantStore();
  const { user: localUser } = useUserStore();

  return useQuery({
    queryKey: ["channel", channelId],
    enabled: isJoined,
    refetchOnWindowFocus: false,
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

        setChannel({ id: channelId });

        return participants;
      } catch (error) {
        console.error(getErrorMessage(error));
        return [];
      }
    },
  });
}

function useCreateChannelMutation() {
  const { toastError, toastSuccess } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createChannel,
    onSuccess: (response) => {
      toastSuccess(response.message);
      navigate(`/channel/${response.data.channelId}`);

      return response.data;
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export { useChannelQuery, useCreateChannelMutation };
