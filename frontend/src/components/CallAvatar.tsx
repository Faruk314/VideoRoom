import { useEffect, useRef } from "react";
import Avatar from "./Avatar";
import classNames from "classnames";
import { useChannelStore } from "../features/channel/store/channel";
import { useLocalParticipantStore } from "../features/channel/store/localParticipant";
import { useParticipantStore } from "../features/channel/store/remoteParticipant";
import {
  getAudioStream,
  getVideoStream,
  isLocalParticipant,
} from "../features/channel/utils/channel";
import CallAvatarOverlay from "./CallAvatarOverlay";
import SpeakingIndicator from "./SpeakingIndicator";

interface Props {
  participantId: string;
  isDisplayed?: boolean;
  isDisplayStream?: boolean;
}

function CallAvatar(props: Props) {
  const { participantId, isDisplayed, isDisplayStream } = props;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const localParticipant = useLocalParticipantStore(
    (state) => state.localParticipant
  );
  const participantsHidden = useChannelStore(
    (state) => state.participantsHidden
  );
  const setDisplayedAvatar = useChannelStore(
    (state) => state.setDisplayedAvatar
  );
  const getParticipant = useParticipantStore((state) => state.getParticipant);

  const participant =
    participantId === localParticipant?.user.userId
      ? localParticipant
      : getParticipant(participantId);

  const isLocal = participant ? isLocalParticipant(participant) : false;
  const videoStream = participant
    ? getVideoStream(participant, isDisplayStream)
    : null;
  const audioStream = participant ? getAudioStream(participant) : null;

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.srcObject = videoStream || null;
    videoEl.play().catch(() => {});
  }, [videoStream]);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    audioEl.srcObject = audioStream || null;
    audioEl.play().catch(() => {});
  }, [audioStream]);

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
          "bg-gray-50": !participant.camMuted,
          "bg-white": participant.camMuted,
        }
      )}
    >
      <SpeakingIndicator
        participantId={participantId}
        isDisplayed={isDisplayed}
        isDisplayStream={isDisplayStream}
      />
      <audio ref={audioRef} playsInline muted={isLocal} />
      {videoStream ? (
        <video
          ref={videoRef}
          playsInline
          muted={isLocal}
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

      <CallAvatarOverlay
        isLocal={isLocal}
        userName={participant.user.userName}
        isMuted={participant.micMuted}
        isDisplayed={isDisplayed}
        isDisplayStream={isDisplayStream}
      />
    </div>
  );
}

export default CallAvatar;
