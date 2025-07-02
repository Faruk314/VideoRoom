import { IconBtn } from "./IconBtn";
import { Video, VideoOff } from "lucide-react";

interface Props {
  camMuted: boolean;
}

export default function CameraBtn({ camMuted = false }: Props) {
  return (
    <IconBtn
      description={camMuted ? "Turn On Camera" : "Turn Off Camera"}
      icon={camMuted ? <VideoOff /> : <Video />}
    />
  );
}
