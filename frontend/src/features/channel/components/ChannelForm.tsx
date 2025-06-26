import { PrimaryInput } from "../../../components/buttons/PrimaryInput";
import { Keyboard, UserPlus, Video } from "lucide-react";
import { PrimaryBtn } from "../../../components/buttons/PrimaryBtn";
import { useChannel } from "../hooks/useChannel";
import Separator from "../../../components/Separator";

export default function ChannelForm() {
  const { createChannel } = useChannel();

  return (
    <div className="flex flex-col items-center space-y-10">
      <div className="flex flex-col items-center space-y-4 md:space-y-0 md:flex-row md:space-x-4">
        <PrimaryInput icon={<Keyboard />} placeholder="Enter code or link" />

        <PrimaryBtn icon={<UserPlus size={20} />}>Join Meeting</PrimaryBtn>
      </div>

      <Separator />

      <PrimaryBtn onClick={createChannel} icon={<Video />}>
        New Meeting
      </PrimaryBtn>
    </div>
  );
}
