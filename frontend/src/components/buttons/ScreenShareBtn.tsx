import useChannelManager from "../../features/channel/hooks/useChannelManager";
import { IconBtn } from "./IconBtn";
import { ScreenShare, ScreenShareOff } from "lucide-react";

interface Props {
  isStreaming: boolean;
}

export default function ScreenShareBtn({ isStreaming = false }: Props) {
  const { toogleScreenShare } = useChannelManager();

  return (
    <IconBtn
      onClick={toogleScreenShare}
      description={isStreaming ? "Stop Streaming" : "Share Your Screen"}
      icon={isStreaming ? <ScreenShareOff /> : <ScreenShare />}
    />
  );
}
