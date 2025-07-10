import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import type { IParticipant } from "../features/channel/types/channel";
import type { Consumer } from "mediasoup-client/types";
import classNames from "classnames";
import { useChannelStore } from "../features/channel/store/channel";
import { IconBtn } from "./buttons/IconBtn";
import { Ellipsis } from "lucide-react";

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
        <span className="absolute bottom-2 left-2 text-white bg-black/60 font-black rounded-md text-[0.9rem] px-2 py-1 slide-up">
          {participant.user.userName}
        </span>
      )}

      {isHovering && (
        <div className="absolute bottom-2 right-2">
          <IconBtn
            className="bg-black/60 opacity-[0.7] md:h-max md:w-max px-2 py-1 rounded-md slide-up hover:bg-black/30"
            icon={<Ellipsis />}
          />
        </div>
      )}
    </div>
  );
}
