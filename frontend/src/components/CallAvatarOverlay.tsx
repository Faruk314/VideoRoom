import { memo } from "react";
import { useChannelStore } from "../features/channel/store/channel";
import { MicOff, ScreenShare } from "lucide-react";
import classNames from "classnames";
import StreamOptions from "./modals/StreamOptions";
import UserOptions from "./modals/UserOptions";

interface Props {
  userName: string;
  isMuted: boolean;
  isLocal: boolean;
  isDisplayed?: boolean;
  isDisplayStream?: boolean;
}

function CallAvatarOverlay({
  userName,
  isMuted,
  isLocal,
  isDisplayed,
  isDisplayStream,
}: Props) {
  const isHovering = useChannelStore((s) => s.isHovering);

  return (
    <>
      {isHovering && (
        <div className="absolute bottom-2 left-2 text-white bg-black/60 font-black rounded-md text-[0.9rem] px-2 slide-up flex items-center space-x-1">
          {isMuted && !isDisplayStream && <MicOff className="h-4 w-4" />}
          {isDisplayStream && <ScreenShare className="h-4 w-4" />}
          <span>{userName}</span>
        </div>
      )}

      <div
        className={classNames(
          "absolute bottom-2 right-2 transition-opacity duration-200",
          {
            hidden: isDisplayed,
            "opacity-0 pointer-events-none": !isHovering,
            "opacity-100 pointer-events-auto": isHovering,
          }
        )}
      >
        {isDisplayStream && isLocal && <StreamOptions />}
        {!isDisplayStream && isLocal && <UserOptions />}
      </div>
    </>
  );
}

export default memo(CallAvatarOverlay);
