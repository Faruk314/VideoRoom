import { useEffect } from "react";
import { MediaDevices as MediaDevicesModal } from "../components/modals/MediaDevices";
import { useMedia } from "../hooks/useMedia";
import { Mic, Phone, ScreenShare, Video } from "lucide-react";
import { IconBtn } from "../components/buttons/IconBtn";
import CallAvatar from "../components/CallAvatar";

export function Room() {
  const { setDevices } = useMedia();

  useEffect(() => {
    setDevices();
  }, []);

  return (
    <section className="flex flex-col gap-4 items-center justify-between h-[100vh] w-full">
      <div className="flex-1 w-full border-b border-gray-300 bg-gray-100"></div>

      <div className="flex space-x-2">
        <CallAvatar />
        <CallAvatar />
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
