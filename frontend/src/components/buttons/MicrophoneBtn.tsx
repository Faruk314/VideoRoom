import { Mic, MicOff } from "lucide-react";
import { IconBtn } from "./IconBtn";
import { useMediaStore } from "../../features/media/store/media";
import MediaPermissions from "../modals/MediaPermissions";
import MissingMediaDevice from "../modals/MissingMediaDevice";
import { useEffect, useState } from "react";
import { useMedia } from "../../features/media/hooks/useMedia";
import useAudioManager from "../../features/channel/hooks/useAudioManager";

interface Props {
  micMuted: boolean;
}

export default function MicrophoneBtn({ micMuted }: Props) {
  const { toogleMicrophone } = useAudioManager();
  const { hasAudioPermission } = useMediaStore();
  const { hasAvailableDevice } = useMedia();
  const [hasMicDevice, setHasMicDevice] = useState(true);

  useEffect(() => {
    hasAvailableDevice("audio")
      .then(setHasMicDevice)
      .catch(() => {
        setHasMicDevice(false);
      });
  }, []);

  if (!hasMicDevice) return <MissingMediaDevice type="microphone" />;

  if (!hasAudioPermission) return <MediaPermissions type="audio" />;

  return (
    <IconBtn
      onClick={toogleMicrophone}
      description={micMuted ? "Unmute" : "Mute"}
      icon={micMuted ? <MicOff size={20} /> : <Mic size={20} />}
      className={`shadow-lg border border-white/10 ${
        micMuted
          ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
          : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
      }`}
    />
  );
}
