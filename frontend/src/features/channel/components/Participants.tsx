import CallAvatar from "../../../components/CallAvatar";
import { useLocalParticipantStore } from "../store/localParticipant";
import { useParticipantStore } from "../store/remoteParticipant";

export default function Participants() {
  const { participants } = useParticipantStore.getState();
  const { localParticipant } = useLocalParticipantStore();

  return (
    <div className="flex space-x-2 mb-24 mt-4">
      {localParticipant && (
        <div
          key={localParticipant.user.userId}
          className="flex space-x-2 participant-group"
        >
          <CallAvatar
            isLocal
            muteCamera
            participantId={localParticipant.user.userId}
            stream={localParticipant.streams.video}
          />

          {localParticipant.streams.screen && (
            <CallAvatar
              isLocal
              participantId={localParticipant.user.userId}
              stream={localParticipant.streams.screen}
              isDisplayStream
            />
          )}
        </div>
      )}

      {[...participants.values()].map((participant) => {
        const videoConsumer = participant.consumers?.video;
        const screenConsumer = participant.consumers?.screen;

        return (
          <div
            key={participant.user.userId}
            className="flex space-x-2 participant-group"
          >
            <CallAvatar
              participantId={participant.user.userId}
              consumer={videoConsumer}
            />

            {screenConsumer && (
              <CallAvatar
                participantId={participant.user.userId}
                consumer={screenConsumer}
                isDisplayStream
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
