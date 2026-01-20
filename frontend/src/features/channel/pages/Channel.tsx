import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../../components/loaders/Loader";
import ChannelFooter from "../components/ChannelFooter";
import { useChannelStore } from "../store/channel";
import useMediasoup from "../../media/hooks/useMediasoup";
import { useChannelQuery } from "../queries/channel";
import { useChannel } from "../hooks/useChannel";
import ChannelParticipants from "../components/ChannelParticipants";
import ChannelAvatar from "../components/ChannelAvatar";

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
    <section className="relative h-[100vh] w-full overflow-hidden bg-[#0B0E14] text-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0B0E14] to-[#0B0E14]"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-500/5 to-transparent"></div>

        {/* Abstract Shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-[8000ms]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] mix-blend-screen animate-pulse delay-1000 duration-[10000ms]"></div>
      </div>

      {/* Main Video Area */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {displayedAvatar && <ChannelAvatar {...displayedAvatar} isDisplayed />}
      </div>

      {/* Participants Overlay */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center pointer-events-none pb-24">
        <div className="pointer-events-auto">
          <ChannelParticipants />
        </div>
      </div>

      <ChannelFooter />
    </section>
  );
}
