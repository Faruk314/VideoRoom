import { useEffect, useState } from "react";
import useChannelManager from "../../features/channel/hooks/useChannelManager";
import { useMediaStore } from "../../features/media/store/media";
import MediaPermissions from "../modals/MediaPermissions";
import MissingMediaDevice from "../modals/MissingMediaDevice";
import { IconBtn } from "./IconBtn";
import { Video, VideoOff } from "lucide-react";
import { useMedia } from "../../features/media/hooks/useMedia";

interface Props {
  camMuted: boolean;
}

export default function CameraBtn({ camMuted = false }: Props) {
  const { toogleCamera } = useChannelManager();
  const { hasVideoPermission } = useMediaStore();
  const { hasAvailableDevice } = useMedia();
  const [hasCamDevice, setHasCamDevice] = useState(true);

  useEffect(() => {
    hasAvailableDevice("video")
      .then(setHasCamDevice)
      .catch(() => {
        setHasCamDevice(false);
      });
  }, []);

  if (!hasCamDevice) return <MissingMediaDevice type="camera" />;

  if (!hasVideoPermission) return <MediaPermissions type="video" />;

  return (
    <IconBtn
      onClick={toogleCamera}
      description={camMuted ? "Turn On Camera" : "Turn Off Camera"}
      icon={camMuted ? <VideoOff /> : <Video />}
    />
  );
}
