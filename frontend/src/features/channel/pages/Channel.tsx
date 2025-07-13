import { useEffect, useRef, useState } from "react";
import CallAvatar from "../../../components/CallAvatar";
import { useChannelQuery } from "../queries/channel";
import { useParams } from "react-router-dom";
import Loader from "../../../components/loaders/Loader";
import { useParticipantStore } from "../store/remoteParticipant";
import useParticipant from "../hooks/useChannelManager";
import ChannelFooter from "../components/ChannelFooter";
import { useLocalParticipantStore } from "../store/localParticipant";
import { useChannelStore } from "../store/channel";

export function Channel() {
  const [isHover, setIsHover] = useState(false);
  const connectingRef = useRef(false);
  const { id } = useParams<{ id: string }>();
  const { isLoading } = useChannelQuery(id || "");
  const { participants } = useParticipantStore.getState();
  const { localParticipant } = useLocalParticipantStore();
  const { connectMediasoup } = useParticipant();
  const displayedAvatar = useChannelStore((state) => state.displayedAvatar);

  useEffect(() => {
    if (!id || connectingRef.current) return;

    connectingRef.current = true;

    (async () => {
      try {
        await connectMediasoup(id);
      } finally {
        connectingRef.current = false;
      }
    })();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="flex flex-col gap-4 items-center justify-between h-[100vh] w-full overflow-y-hidden bg-gray-100"
    >
      <div className="flex-1 flex items-center justify-center w-full pt-4">
        {displayedAvatar && <CallAvatar {...displayedAvatar} isDisplayed />}
      </div>

      <div className="flex space-x-2 mb-24">
        {localParticipant && (
          <div
            key={localParticipant.user.userId}
            className="flex space-x-2 participant-group"
          >
            <CallAvatar
              muteCamera
              participant={localParticipant}
              stream={localParticipant.streams.video}
            />

            {localParticipant.streams.screen && (
              <CallAvatar
                participant={localParticipant}
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
              <CallAvatar participant={participant} consumer={videoConsumer} />

              {screenConsumer && (
                <CallAvatar
                  participant={participant}
                  consumer={screenConsumer}
                  isDisplayStream
                />
              )}
            </div>
          );
        })}
      </div>

      {isHover && <ChannelFooter />}
    </section>
  );
}
