import classNames from "classnames";
import { useChannelStore } from "../store/channel";
import SpeakingIndicator from "../../../components/SpeakingIndicator";
import ChannelAvatarAudio from "./ChannelAvatarAudio";
import ChannelAvatarVideo from "./ChannelAvatarVideo";
import ChannelAvatarOverlay from "./ChannelAvatarOverlay";
import { useParticipantStore } from "../store/remoteParticipant";
import { useLocalParticipantStore } from "../store/localParticipant";

interface Props {
  participantId: string;
  isDisplayed?: boolean;
  isDisplayStream?: boolean;
}

function ChannelAvatar({ participantId, isDisplayed, isDisplayStream }: Props) {
  const setDisplayedAvatar = useChannelStore((s) => s.setDisplayedAvatar);
  const displayedAvatar = useChannelStore((state) => state.displayedAvatar);
  const getParticipant = useParticipantStore((state) => state.getParticipant);
  const localParticipant = useLocalParticipantStore(
    (state) => state.localParticipant
  );

  const isLocal = participantId === localParticipant?.user.userId;

  const participant = isLocal
    ? localParticipant
    : getParticipant(participantId);

  const audioStream = participant?.streams?.audio;

  const videoStream = isDisplayStream
    ? participant?.streams?.screen
    : participant?.streams?.video;

  function handleClick() {
    if (!participant) return;

    if (displayedAvatar?.participantId === participant.user.userId) {
      if (displayedAvatar?.isDisplayStream === isDisplayStream) return;
    }

    setDisplayedAvatar({
      participantId: participant.user.userId,
      isDisplayStream: isDisplayStream,
    });
  }

  if (!participant) return null;

  return (
    <div
      onClick={handleClick}
      className={classNames(
        "relative border border-white/10 w-55 h-30 flex items-center justify-center overflow-hidden cursor-pointer rounded-xl transition-all duration-300",
        {
          "!w-full !h-full border-none rounded-2xl": isDisplayed,
          "bg-[#0f1219]": !participant.camMuted,
          "bg-[#0f1219]/50 backdrop-blur-sm": participant.camMuted,
        }
      )}
    >
      <SpeakingIndicator
        participantId={participant.user.userId}
        isDisplayStream={isDisplayStream}
        isDisplayed={isDisplayed}
      />

      <ChannelAvatarAudio audioStream={audioStream} isLocal={isLocal} />

      <ChannelAvatarVideo
        userName={participant?.user.userName}
        videoStream={videoStream}
        isDisplayed={isDisplayed}
      />

      {isDisplayStream && (
        <div className="absolute top-2 right-2 text-white bg-red-500 font-bold rounded-full text-[0.8rem] px-2 py-0.5 shadow-lg">
          Live
        </div>
      )}

      {!participant?.connected && (
        <div className="absolute top-2 left-2 text-white bg-red-500 font-bold rounded-full text-[0.8rem] px-2 py-0.5 shadow-lg">
          Offline
        </div>
      )}

      <ChannelAvatarOverlay
        isLocal={isLocal}
        userName={participant?.user.userName}
        isMuted={participant?.micMuted}
        isDisplayed={isDisplayed}
        isDisplayStream={isDisplayStream}
      />
    </div>
  );
}

export default ChannelAvatar;
