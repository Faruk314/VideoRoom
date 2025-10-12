import { useEffect, useRef } from "react";
import CallAvatar from "../../../components/CallAvatar";
import { useParams } from "react-router-dom";
import Loader from "../../../components/loaders/Loader";
import ChannelFooter from "../components/ChannelFooter";
import { useChannelStore } from "../store/channel";
import useMediasoup from "../../media/hooks/useMediasoup";
import { useChannelQuery } from "../queries/channel";
import Participants from "../components/Participants";
import { useChannel } from "../hooks/useChannel";

export function Channel() {
  const { id } = useParams<{ id: string }>();
  const { connectMediasoup } = useMediasoup();
  const { joinChannel } = useChannel();
  const displayedAvatar = useChannelStore((state) => state.displayedAvatar);
  const hasInitializedRef = useRef(false);

  const { isLoading, refetch: fetchChannelData } = useChannelQuery(
    id || "",
    false
  );

  useEffect(() => {
    if (!id || hasInitializedRef.current) return;

    hasInitializedRef.current = true;

    const initializeChannel = async () => {
      try {
        await joinChannel(id);

        await fetchChannelData();

        await connectMediasoup(id);
      } catch (err) {
        console.error("Channel initialization failed:", err);
      }
    };

    initializeChannel();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="flex flex-col items-center justify-between h-[100vh] w-full overflow-hidden bg-gray-100">
      <div className="flex-1 flex items-center justify-center w-full">
        {displayedAvatar && <CallAvatar {...displayedAvatar} isDisplayed />}
      </div>

      <Participants />

      <ChannelFooter />
    </section>
  );
}
