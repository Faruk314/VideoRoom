import { PrimaryInput } from "../../../components/buttons/PrimaryInput";
import { Keyboard, UserPlus, Video } from "lucide-react";
import { PrimaryBtn } from "../../../components/buttons/PrimaryBtn";
import { useChannel } from "../hooks/useChannel";
import Separator from "../../../components/Separator";
import { useState } from "react";

export default function ChannelForm() {
  const { createChannel, joinChannel } = useChannel();
  const [input, setInput] = useState("");

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
          onClick={() => joinChannel(input)}
          icon={<UserPlus size={20} />}
        >
          Join Meeting
        </PrimaryBtn>
      </div>

      <Separator />

      <PrimaryBtn onClick={createChannel} icon={<Video />}>
        New Meeting
      </PrimaryBtn>
    </div>
  );
}
