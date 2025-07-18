import { Maximize, Phone } from "lucide-react";
import { IconBtn } from "../../../components/buttons/IconBtn";
import { Settings as SettingsModal } from "../../../components/modals/Settings";
import CameraBtn from "../../../components/buttons/CameraBtn";
import MicrophoneBtn from "../../../components/buttons/MicrophoneBtn";
import ScreenShareBtn from "../../../components/buttons/ScreenShareBtn";
import { useLocalParticipantStore } from "../store/localParticipant";
import { useChannel } from "../hooks/useChannel";
import { useChannelStore } from "../store/channel";
import classNames from "classnames";
import HideParticipantsBtn from "../../../components/buttons/HideParticipantsBtn";
import type { RefObject } from "react";

interface Props {
  sectionRef: RefObject<HTMLElement | null>;
}

export default function ChannelFooter({ sectionRef }: Props) {
  const { localParticipant } = useLocalParticipantStore();
  const { isHovering } = useChannelStore();
  const { leaveChannel } = useChannel();

  function handleFullScreen() {
    const element = sectionRef.current;

    if (!element) return;

    if (!document.fullscreenElement) {
      element.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  return (
    <div
      className={classNames(
        "fixed bottom-0 w-full mb-4 slide-up z-50",
        isHovering ? "slide-up" : "slide-down"
      )}
    >
      <div className="relative flex items-center justify-between w-full mx-auto py-2 px-4">
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 flex items-center space-x-2 border border-gray-300 rounded-md px-2 py-2 shadow-md bg-white z-50">
          <CameraBtn camMuted={localParticipant?.camMuted || false} />
          <MicrophoneBtn micMuted={localParticipant?.micMuted || false} />
          <ScreenShareBtn
            isStreaming={localParticipant?.isStreaming || false}
          />
          <SettingsModal />
          <IconBtn
            onClick={leaveChannel}
            description="Leave Call"
            icon={<Phone size={20} />}
            className="text-white bg-red-500 hover:bg-red-400"
          />
        </div>

        <div className="fixed bottom-0 right-6 flex space-x-2 z-50">
          <IconBtn
            onClick={handleFullScreen}
            description="Fullscreen"
            className="bg-transparent text-black hover:bg-gray-200"
            icon={<Maximize size={30} />}
          />
        </div>

        <HideParticipantsBtn />
      </div>
    </div>
  );
}
