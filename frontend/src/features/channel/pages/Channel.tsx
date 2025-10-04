import { useEffect, useRef, useState } from "react";
import CallAvatar from "../../../components/CallAvatar";
import { useParams } from "react-router-dom";
import Loader from "../../../components/loaders/Loader";
import ChannelFooter from "../components/ChannelFooter";
import { useChannelStore } from "../store/channel";
import useMediasoup from "../../media/hooks/useMediasoup";
import { useChannel } from "../hooks/useChannel";
import { useChannelQuery } from "../queries/channel";
import Participants from "../components/Participants";

export function Channel() {
  const [hasJoined, setHasJoined] = useState(false);
  const connectingRef = useRef(false);
  const { id } = useParams<{ id: string }>();
  const { connectMediasoup } = useMediasoup();
  const { joinChannel } = useChannel();
  const displayedAvatar = useChannelStore((state) => state.displayedAvatar);
  const { participantsHidden } = useChannelStore();

  useEffect(() => {
    if (!id || hasJoined) return;

    async function handleJoin() {
      try {
        await joinChannel(id!);
        setHasJoined(true);
      } catch (e) {
        console.error("Join failed", e);
      }
    }

    handleJoin();
  }, [id, hasJoined]);

  const { isLoading } = useChannelQuery(id || "", hasJoined);

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
    <section className="flex flex-col items-center justify-between h-[100vh] w-full overflow-hidden bg-gray-100">
      <div className="flex-1 flex items-center justify-center w-full">
        {displayedAvatar && <CallAvatar {...displayedAvatar} isDisplayed />}
      </div>

      {!participantsHidden && <Participants />}

      <ChannelFooter />
    </section>
  );
}
