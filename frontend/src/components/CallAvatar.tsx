import { useEffect, useRef } from "react";
import Avatar from "./Avatar";
import type { Consumer } from "mediasoup-client/types";
import classNames from "classnames";
import { useChannelStore } from "../features/channel/store/channel";
import UserOptions from "./modals/UserOptions";
import StreamOptions from "./modals/StreamOptions";
import { MicOff, ScreenShare } from "lucide-react";
import { useLocalParticipantStore } from "../features/channel/store/localParticipant";
import { useParticipantStore } from "../features/channel/store/remoteParticipant";

interface Props {
  participantId: string;
  isLocal?: boolean;
  consumer?: Consumer | null;
  stream?: MediaStream | null;
  isDisplayStream?: boolean;
  muteCamera?: boolean;
  isDisplayed?: boolean;
}

export default function CallAvatar(props: Props) {
  const {
    participantId,
    isLocal,
    consumer,
    stream,
    isDisplayStream,
    muteCamera,
    isDisplayed,
  } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { localParticipant } = useLocalParticipantStore();
  const { isHovering, participantsHidden } = useChannelStore();
  const { getParticipant } = useParticipantStore();

  const participant = isLocal
    ? localParticipant
    : getParticipant(participantId);

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

  if (!participant) return null;

  return (
    <div
      onClick={() => setDisplayedAvatar({ ...props })}
      className={classNames(
        "relative border bg-gray-100 w-55 h-30 flex items-center justify-center overflow-hidden cursor-pointer",
        {
          "object-contain w-full h-[30vh] px-4 lg:px-0 lg:w-[75vw] lg:h-[85vh] border-none":
            isDisplayed && participantsHidden,
          "w-[70rem] h-full border-none": isDisplayed && !participantsHidden,
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
          className="object-contain"
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
