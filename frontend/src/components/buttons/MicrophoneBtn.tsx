import { Mic, MicOff } from "lucide-react";
import { IconBtn } from "./IconBtn";
import useChannelManager from "../../features/channel/hooks/useChannelManager";

interface Props {
  micMuted: boolean;
}

export default function MicrophoneBtn({ micMuted }: Props) {
  const { toogleMicrophone } = useChannelManager();

  return (
    <IconBtn
      onClick={toogleMicrophone}
      description={micMuted ? "Unmute" : "Mute"}
      icon={micMuted ? <MicOff /> : <Mic />}
    />
  );
}
