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
          "fixed bottom-0 w-full slide-up z-50",
          isHovering ? "slide-up" : "slide-down"
        )}
      >
        <div className="relative flex items-center justify-between w-full mx-auto py-2 px-4">
          {/* Main Controls */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-3 px-4 py-3 rounded-2xl bg-[#0f1219]/80 backdrop-blur-xl border border-white/10 shadow-2xl ring-1 ring-white/5 z-50">
            <CameraBtn camMuted={localParticipant?.camMuted || false} />
            <MicrophoneBtn micMuted={localParticipant?.micMuted || false} />
            <ScreenShareBtn
              isStreaming={localParticipant?.isStreaming || false}
            />
            <SettingsModal />
            <div className="w-px h-8 bg-white/10 mx-2" />
            <IconBtn
              onClick={leaveChannel}
              description="Leave Call"
              icon={<Phone size={20} />}
              className="text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
            />
          </div>

          <div className="hidden md:flex fixed bottom-6 right-6 z-50 space-x-2">
            <ChannelDetails />
            <ChannelChatSidebar />
            <FullScreenBtn />
          </div>

          <HideParticipantsBtn />
        </div>
      </div>
      <div
        className={classNames(
          "fixed top-4 left-4 z-50 md:hidden flex space-x-2",
          isHovering ? "flex" : "hidden"
        )}
      >
        <ChannelDetails />
        <FullScreenBtn />
      </div>

      <div
        className={classNames(
          "fixed top-4 right-4 z-50 md:hidden",
          isHovering ? "flex" : "hidden"
        )}
      >
        <ChannelChatSidebar />
      </div>
    </>
  );
}
