import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import type { IParticipant } from "../features/channel/types/channel";
import type { Consumer } from "mediasoup-client/types";
import classNames from "classnames";
import { useChannelStore } from "../features/channel/store/channel";
import UserOptions from "./modals/UserOptions";
import StreamOptions from "./modals/StreamOptions";

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
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const setDisplayedAvatar = useChannelStore(
    (state) => state.setDisplayedAvatar
  );

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
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => setDisplayedAvatar({ ...props })}
      className={classNames(
        "relative border border-gray-300 w-55 h-30 rounded-md flex items-center justify-center overflow-hidden cursor-pointer",
        {
          "w-[70rem] h-full": isDisplayed,
          "bg-black": hasVideo,
          "bg-white": !hasVideo,
        }
      )}
    >
      {hasVideo ? (
        <video ref={videoRef} playsInline muted={muteCamera} autoPlay />
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
        <span
          className={classNames(
            "absolute bottom-2 left-2 text-white bg-black/60 font-black rounded-md text-[0.9rem] px-2 slide-up",
            {
              "py-0": !isDisplayed,
              "py-1": isDisplayed,
            }
          )}
        >
          {participant.user.userName}
        </span>
      )}

      <div
        className={classNames(
          "absolute bottom-2 right-2 transition-opacity duration-200",
          {
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
