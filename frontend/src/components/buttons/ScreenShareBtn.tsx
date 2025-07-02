import { IconBtn } from "./IconBtn";
import { ScreenShare, ScreenShareOff } from "lucide-react";

interface Props {
  isStreaming: boolean;
}

export default function ScreenShareBtn({ isStreaming = false }: Props) {
  return (
    <IconBtn
      description={isStreaming ? "Stop Streaming" : "Share Your Screen"}
      icon={isStreaming ? <ScreenShareOff /> : <ScreenShare />}
    />
  );
}
