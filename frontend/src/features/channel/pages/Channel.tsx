import { useEffect, useRef } from "react";
import CallAvatar from "../../../components/CallAvatar";
import { useChannelQuery } from "../queries/channel";
import { useParams } from "react-router-dom";
import Loader from "../../../components/loaders/Loader";
import ChannelFooter from "../components/ChannelFooter";
import { useChannelStore } from "../store/channel";
import Participants from "../components/Participants";
import useMediasoup from "../../media/hooks/useMediasoup";
import { useMouseHover } from "../../../hooks/useMouseHover";

export function Channel() {
  const connectingRef = useRef(false);
  const { id } = useParams<{ id: string }>();
  const { isLoading } = useChannelQuery(id || "");
  const { connectMediasoup } = useMediasoup();
  const displayedAvatar = useChannelStore((state) => state.displayedAvatar);
  const { participantsHidden } = useChannelStore();

  useEffect(() => {}, []);

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

  useMouseHover(2000);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="flex flex-col items-center justify-between h-[100vh] w-full overflow-y-hidden bg-white">
      <div className="flex-1 flex items-center justify-center w-full">
        {displayedAvatar && <CallAvatar {...displayedAvatar} isDisplayed />}
      </div>

      {!participantsHidden && <Participants />}

      <ChannelFooter />
    </section>
  );
}
