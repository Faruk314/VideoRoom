import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import type { IParticipant } from "../features/channel/types/channel";
import type { Consumer } from "mediasoup-client/types";
import classNames from "classnames";
import { useChannelStore } from "../features/channel/store/channel";

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
        <div className="absolute top-1 right-1 text-white bg-red-500 font-black rounded-full text-[0.9rem] px-2">
          Live
        </div>
      )}

      {isHovering && (
        <span className="absolute bottom-1 left-1 text-white bg-black font-black rounded-full text-[0.9rem] px-2 slide-up">
          {participant.user.userName}
        </span>
      )}
    </div>
  );
}
