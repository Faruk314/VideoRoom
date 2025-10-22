import { PrimaryInput } from "../../../components/buttons/PrimaryInput";
import { Keyboard, UserPlus, Video } from "lucide-react";
import { PrimaryBtn } from "../../../components/buttons/PrimaryBtn";
import Separator from "../../../components/Separator";
import { useState } from "react";
import { extractChannelId } from "../utils/channel";
import { useToast } from "../../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { useCreateChannelMutation } from "../queries/channel";
import { Spinner } from "../../../components/loaders/Spinner";

export default function ChannelForm() {
  const createChannelMutation = useCreateChannelMutation();
  const navigate = useNavigate();
  const { toastError } = useToast();
  const [input, setInput] = useState("");

  async function handleJoin() {
    const channelId = extractChannelId(input);

    if (!channelId) {
      return toastError("Invalid url or code");
    }

    navigate(`/channel/${channelId}`);
  }

  return (
    <div className="flex flex-col items-center space-y-10">
      <div className="flex flex-col items-center space-y-4 md:space-y-0 md:flex-row md:space-x-4">
        <PrimaryInput
          onChange={(e) => setInput(e.target.value)}
          icon={<Keyboard />}
          placeholder="Enter code or link"
        />

        <PrimaryBtn
          disabled={input.length === 0}
          onClick={handleJoin}
          icon={<UserPlus size={20} />}
        >
          Join Meeting
        </PrimaryBtn>
      </div>

      <Separator />

      <PrimaryBtn
        onClick={() => createChannelMutation.mutate()}
        icon={<Video />}
        disabled={createChannelMutation.isPending}
      >
        {createChannelMutation.isPending ? (
          <Spinner className="h-6 w-6" />
        ) : (
          "New Meeting"
        )}
      </PrimaryBtn>
    </div>
  );
}
