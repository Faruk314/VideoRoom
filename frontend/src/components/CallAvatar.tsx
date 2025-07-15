import { useEffect, useRef } from "react";
import Avatar from "./Avatar";
import type { IParticipant } from "../features/channel/types/channel";
import type { Consumer } from "mediasoup-client/types";
import classNames from "classnames";
import { useChannelStore } from "../features/channel/store/channel";
import UserOptions from "./modals/UserOptions";
import StreamOptions from "./modals/StreamOptions";
import { MicOff, ScreenShare } from "lucide-react";

interface Props {
  participant: Omit<IParticipant, "consumers">;
  consumer?: Consumer | null;
  stream?: MediaStream | null;
  isDisplayStream?: boolean;
  muteCamera?: boolean;
  isDisplayed?: boolean;
}

export default function CallAvatar(props: Props) {
  const {
    participant,
    consumer,
    stream,
    isDisplayStream,
    muteCamera,
    isDisplayed,
  } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const setDisplayedAvatar = useChannelStore(
    (state) => state.setDisplayedAvatar
  );
  const { isHovering, participantsHidden } = useChannelStore();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (stream) {
      video.srcObject = stream;
      video.play().catch(() => {});
    } else if (consumer?.track) {
      const consumerStream = new MediaStream([consumer.track]);
      video.srcObject = consumerStream;
      video.play().catch(() => {});
    } else {
      video.srcObject = null;
    }

    return () => {
      if (video) video.srcObject = null;
    };
  }, [consumer, stream]);

  const hasVideo = !!stream || !!consumer?.track;

  return (
    <div
      onClick={() => setDisplayedAvatar({ ...props })}
      className={classNames(
        "relative shadow-md w-55 h-30 flex items-center justify-center overflow-hidden cursor-pointer",
        {
          "w-screen h-screen": isDisplayed && participantsHidden,
          "w-[70rem] h-full": isDisplayed && !participantsHidden,
          "bg-gray-50": hasVideo,
          "bg-white": !hasVideo,
          "border-3 border-green-600":
            participant.isSpeaking && !isDisplayed && !isDisplayStream,
        }
      )}
    >
      {hasVideo ? (
        <video
          ref={videoRef}
          playsInline
          muted={muteCamera}
          autoPlay
          className="w-full h-full object-fill"
        />
      ) : (
        <Avatar
          className={classNames("text-2xl", {
            "text-7xl h-30 w-30": isDisplayed,
          })}
          name={participant.user.userName}
        />
      )}

      {isDisplayStream && (
        <div className="absolute top-2 right-2 text-white bg-red-500 font-black rounded-full text-[0.9rem] px-2">
          Live
        </div>
      )}

      {isHovering && (
        <div
          className={classNames(
            "absolute bottom-2 left-2 text-white bg-black/60 font-black rounded-md text-[0.9rem] px-2 slide-up flex items-center space-x-1",
            {
              "py-0": !isDisplayed,
              "py-1": isDisplayed,
            }
          )}
        >
          {participant.micMuted && !isDisplayStream && (
            <MicOff className="h-4 w-4" />
          )}
          {isDisplayStream && <ScreenShare className="h-4 w-4" />}
          <span>{participant.user.userName}</span>
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
        {isDisplayStream ? <StreamOptions /> : <UserOptions />}
      </div>
    </div>
  );
}
