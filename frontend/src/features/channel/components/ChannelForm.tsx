import { PrimaryInput } from "../../../components/buttons/PrimaryInput";
import { Keyboard, Video, ArrowRight } from "lucide-react";
import { PrimaryBtn } from "../../../components/buttons/PrimaryBtn";
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
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-semibold text-blue-200/80 ml-1 uppercase tracking-wider">
          Join Meeting
        </label>
        <div className="flex flex-col space-y-3">
          <PrimaryInput
            onChange={(e) => setInput(e.target.value)}
            value={input}
            icon={<Keyboard size={20} className="text-blue-300/50" />}
            placeholder="Enter meeting code or link"
          />
          <PrimaryBtn
            disabled={input.length === 0}
            onClick={handleJoin}
            className="w-full font-bold py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-200 border border-blue-500/20"
            icon={<ArrowRight size={20} />}
          >
            Join Existing
          </PrimaryBtn>
        </div>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/5" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#0f1219] px-2 text-blue-200/30 font-semibold tracking-wider">
            Or start fresh
          </span>
        </div>
      </div>

      <div className="pt-2">
        <PrimaryBtn
          onClick={() => createChannelMutation.mutate()}
          className="w-full text-lg font-bold shadow-blue-900/20 py-3"
          disabled={createChannelMutation.isPending}
          icon={
            !createChannelMutation.isPending ? <Video size={20} /> : undefined
          }
        >
          {createChannelMutation.isPending ? (
            <Spinner className="h-6 w-6 text-white/90" />
          ) : (
            "New Meeting"
          )}
        </PrimaryBtn>
      </div>
    </div>
  );
}
