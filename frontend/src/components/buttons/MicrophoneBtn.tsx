import { Mic, MicOff } from "lucide-react";
import { IconBtn } from "./IconBtn";
import useChannelManager from "../../features/channel/hooks/useChannelManager";
import { useMediaStore } from "../../features/media/store/media";
import MediaPermissions from "../modals/MediaPermissions";

interface Props {
  micMuted: boolean;
}

export default function MicrophoneBtn({ micMuted }: Props) {
  const { toogleMicrophone } = useChannelManager();
  const { hasAudioPermission } = useMediaStore();

  return (
    <>
      {hasAudioPermission ? (
        <IconBtn
          onClick={toogleMicrophone}
          description={micMuted ? "Unmute" : "Mute"}
          icon={micMuted ? <MicOff /> : <Mic />}
        />
      ) : (
        <MediaPermissions type="audio" />
      )}
    </>
  );
}
