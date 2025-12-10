import { Phone } from "lucide-react";
import { IconBtn } from "../../../components/buttons/IconBtn";
import { Settings as SettingsModal } from "../../../components/modals/Settings";
import CameraBtn from "../../../components/buttons/CameraBtn";
import MicrophoneBtn from "../../../components/buttons/MicrophoneBtn";
import ScreenShareBtn from "../../../components/buttons/ScreenShareBtn";
import { useLocalParticipantStore } from "../store/localParticipant";
import { useChannel } from "../hooks/useChannel";
import classNames from "classnames";
import HideParticipantsBtn from "../../../components/buttons/HideParticipantsBtn";
import FullScreenBtn from "../../../components/buttons/FullScreenBtn";
import ChannelDetails from "../../../components/modals/ChannelDetails";
import { useMouseHover } from "../../../hooks/useMouseHover";
import ChannelChatSidebar from "./ChannelSidebar";
import { useChannelHoverStore } from "../store/channelHover";

export default function ChannelFooter() {
  const localParticipant = useLocalParticipantStore(
    (state) => state.localParticipant
  );
  const isHovering = useChannelHoverStore((state) => state.isHovering);
  const { leaveChannel } = useChannel();

  useMouseHover(2000);

  return (
    <>
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

          <div className="hidden md:flex fixed bottom-0 right-6 z-50">
            <ChannelDetails />
            <ChannelChatSidebar />
            <FullScreenBtn />
          </div>

          <HideParticipantsBtn />
        </div>
      </div>
      <div
        className={classNames(
          "fixed top-2 left-2 z-50 md:hidden",
          isHovering ? "flex" : "hidden"
        )}
      >
        <ChannelDetails />
        <FullScreenBtn />
      </div>

      <div
        className={classNames(
          "fixed top-2 right-2 z-50 md:hidden",
          isHovering ? "flex" : "hidden"
        )}
      >
        <ChannelChatSidebar />
      </div>
    </>
  );
}
