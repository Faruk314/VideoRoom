import { Mic, MicOff } from "lucide-react";
import { IconBtn } from "./IconBtn";

interface Props {
  micMuted: boolean;
}

export default function MicrophoneBtn({ micMuted }: Props) {
  return (
    <IconBtn
      description={micMuted ? "Unmute" : "Mute"}
      icon={micMuted ? <MicOff /> : <Mic />}
    />
  );
}
