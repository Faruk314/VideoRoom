import { Phone } from "lucide-react";
import { IconBtn } from "../../../components/buttons/IconBtn";
import { Settings as SettingsModal } from "../../../components/modals/Settings";
import CameraBtn from "../../../components/buttons/CameraBtn";
import MicrophoneBtn from "../../../components/buttons/MicrophoneBtn";
import ScreenShareBtn from "../../../components/buttons/ScreenShareBtn";
import { useLocalParticipantStore } from "../store/localParticipant";
import { useChannel } from "../hooks/useChannel";

export default function ChannelFooter() {
  const { localParticipant } = useLocalParticipantStore();
  const { leaveChannel } = useChannel();

  return (
    <div className="flex items-center justify-center py-4 space-x-4 border border-gray-300 w-full">
      <div className="flex items-center space-x-2">
        <CameraBtn camMuted={localParticipant?.camMuted || false} />

        <MicrophoneBtn micMuted={localParticipant?.micMuted || false} />

        <ScreenShareBtn isStreaming={localParticipant?.isStreaming || false} />

        <SettingsModal />

        <IconBtn
          onClick={leaveChannel}
          description="Leave Call"
          icon={<Phone size={20} />}
          className="text-white bg-red-500 hover:bg-red-400"
        />
      </div>

      {/* <button className="justify-self-end">
        <Fullscreen />
      </button> */}
    </div>
  );
}
