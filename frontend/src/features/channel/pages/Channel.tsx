import { useEffect, useRef } from "react";
import CallAvatar from "../../../components/CallAvatar";
import { useChannelQuery } from "../queries/channel";
import { useParams } from "react-router-dom";
import Loader from "../../../components/loaders/Loader";
import { useParticipantStore } from "../store/remoteParticipant";
import useParticipant from "../hooks/useChannelManager";
import ChannelFooter from "../components/ChannelFooter";
import { useLocalParticipantStore } from "../store/localParticipant";

export function Channel() {
  const connectingRef = useRef(false);
  const { id } = useParams<{ id: string }>();
  const { isLoading } = useChannelQuery(id || "");
  const { participants } = useParticipantStore.getState();
  const { localParticipant } = useLocalParticipantStore();
  const { connectMediasoup } = useParticipant();

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
    <section className="flex flex-col gap-4 items-center justify-between h-[100vh] w-full">
      <div className="flex-1 w-full"></div>

      <div className="flex space-x-2">
        {localParticipant && (
          <div
            key={localParticipant.user.userId}
            className="flex space-x-2 participant-group"
          >
            <CallAvatar
              participant={localParticipant}
              stream={localParticipant.streams.video}
            />

            {localParticipant.streams.screen && (
              <CallAvatar
                participant={localParticipant}
                stream={localParticipant.streams.screen}
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
                />
              )}
            </div>
          );
        })}
      </div>

      <ChannelFooter />
    </section>
  );
}
