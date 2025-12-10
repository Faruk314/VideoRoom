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
  const participantsHidden = useChannelStore(
    (state) => state.participantsHidden
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
        "relative border bg-gray-100 w-55 h-30 flex items-center justify-center overflow-hidden cursor-pointer",
        {
          "w-full h-[30vh] px-4 lg:px-0 lg:w-[100rem] lg:h-[85vh] border-none":
            isDisplayed && participantsHidden,
          "w-[90rem] h-full border-none": isDisplayed && !participantsHidden,
          "bg-gray-50": !participant.camMuted,
          "bg-white": participant.camMuted,
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
        isLocal={isLocal}
        isDisplayed={isDisplayed}
      />

      {isDisplayStream && (
        <div className="absolute top-2 right-2 text-white bg-red-500 font-black rounded-full text-[0.9rem] px-2">
          Live
        </div>
      )}

      {!participant?.connected && (
        <div className="absolute top-2 left-2 text-white bg-red-500 font-black rounded-full text-[0.9rem] px-2">
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
