import { useEffect } from "react";
import { MediaDevices as MediaDevicesModal } from "../../../components/modals/MediaDevices";
import { useMedia } from "../../media/hooks/useMedia";
import { Mic, Phone, ScreenShare, Video } from "lucide-react";
import { IconBtn } from "../../../components/buttons/IconBtn";
import CallAvatar from "../../../components/CallAvatar";
import { useChannelQuery } from "../queries/channel";
import { useParams } from "react-router-dom";
import Loader from "../../../components/loaders/Loader";
import { useChannelStore } from "../store/channel";

export function Channel() {
  const { id } = useParams<{ id: string }>();
  const { setDevices } = useMedia();
  const { isLoading } = useChannelQuery(id || "");
  const { participants } = useChannelStore();

  console.log(participants, "part");

  useEffect(() => {
    setDevices();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="flex flex-col gap-4 items-center justify-between h-[100vh] w-full">
      <div className="flex-1 w-full"></div>

      <div className="flex space-x-2">
        {[...participants.values()].map((participant) => (
          <CallAvatar key={participant.user.userId} />
        ))}
      </div>

      <div className="flex space-x-4 border border-gray-300 px-5 md:px-14 py-3 rounded-full shadow-md mb-4">
        <IconBtn icon={<Video />} />

        <IconBtn icon={<Mic />} />

        <IconBtn icon={<ScreenShare />} />

        <MediaDevicesModal />

        <IconBtn
          icon={<Phone size={20} />}
          className="text-white bg-red-500 hover:bg-red-400"
        />
      </div>
    </section>
  );
}
