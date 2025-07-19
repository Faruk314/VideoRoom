import useChannelManager from "../../features/channel/hooks/useChannelManager";
import { useMediaStore } from "../../features/media/store/media";
import MediaPermissions from "../modals/MediaPermissions";
import { IconBtn } from "./IconBtn";
import { Video, VideoOff } from "lucide-react";

interface Props {
  camMuted: boolean;
}

export default function CameraBtn({ camMuted = false }: Props) {
  const { toogleCamera } = useChannelManager();
  const { hasVideoPermission } = useMediaStore();

  return (
    <>
      {hasVideoPermission ? (
        <IconBtn
          onClick={toogleCamera}
          description={camMuted ? "Turn On Camera" : "Turn Off Camera"}
          icon={camMuted ? <VideoOff /> : <Video />}
        />
      ) : (
        <MediaPermissions type="video" />
      )}
    </>
  );
}
