import { useEffect } from "react";
import { MediaDevices as MediaDevicesModal } from "../components/modals/MediaDevices";
import { useMedia } from "../hooks/useMedia";

export function Room() {
  const { setDevices } = useMedia();

  useEffect(() => {
    setDevices();
  }, []);

  return (
    <section className="flex items-center justify-center h-[100vh] w-full">
      <MediaDevicesModal />
    </section>
  );
}
