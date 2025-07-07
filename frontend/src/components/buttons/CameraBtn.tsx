import useChannelManager from "../../features/channel/hooks/useChannelManager";
import { IconBtn } from "./IconBtn";
import { Video, VideoOff } from "lucide-react";

interface Props {
  camMuted: boolean;
}

export default function CameraBtn({ camMuted = false }: Props) {
  const { toogleCamera } = useChannelManager();

  return (
    <IconBtn
      onClick={toogleCamera}
      description={camMuted ? "Turn On Camera" : "Turn Off Camera"}
      icon={camMuted ? <VideoOff /> : <Video />}
    />
  );
}
