import useScreenShareManager from "../../features/channel/hooks/useScreenShareManager";
import { IconBtn } from "./IconBtn";
import { ScreenShare, ScreenShareOff } from "lucide-react";

interface Props {
  isStreaming: boolean;
}

export default function ScreenShareBtn({ isStreaming = false }: Props) {
  const { toogleScreenShare } = useScreenShareManager();

  return (
    <IconBtn
      onClick={toogleScreenShare}
      description={isStreaming ? "Stop Streaming" : "Share Your Screen"}
      icon={isStreaming ? <ScreenShareOff size={20} /> : <ScreenShare size={20} />}
      className={`shadow-lg border border-white/10 ${
        isStreaming
          ? "bg-green-600 hover:bg-green-500 text-white shadow-green-500/20"
          : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
      }`}
    />
  );
}
