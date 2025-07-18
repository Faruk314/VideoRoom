import { useEffect, useRef } from "react";
import CallAvatar from "../../../components/CallAvatar";
import { useChannelQuery } from "../queries/channel";
import { useParams } from "react-router-dom";
import Loader from "../../../components/loaders/Loader";
import ChannelFooter from "../components/ChannelFooter";
import { useChannelStore } from "../store/channel";
import Participants from "../components/Participants";
import useMediasoup from "../../media/hooks/useMediasoup";

export function Channel() {
  const sectionRef = useRef<HTMLElement>(null);
  const connectingRef = useRef(false);
  const { id } = useParams<{ id: string }>();
  const { isLoading } = useChannelQuery(id || "");
  const { connectMediasoup } = useMediasoup();
  const displayedAvatar = useChannelStore((state) => state.displayedAvatar);
  const { isHovering, setIsHovering, participantsHidden } = useChannelStore();

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

  useEffect(() => {
    let timeoutId: any;

    const handleMouseMove = () => {
      if (!isHovering) setIsHovering(true);

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsHovering(false);
      }, 2000);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [isHovering]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section
      ref={sectionRef}
      className="flex flex-col items-center justify-between h-[100vh] w-full overflow-y-hidden bg-white"
    >
      <div className="flex-1 flex items-center justify-center w-full">
        {displayedAvatar && <CallAvatar {...displayedAvatar} isDisplayed />}
      </div>

      {!participantsHidden && <Participants />}

      <ChannelFooter sectionRef={sectionRef} />
    </section>
  );
}
