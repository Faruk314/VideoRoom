import { useEffect } from "react";
import { useMediaStore } from "../features/media/store/media";
import { PrimarySelect } from "./selects/PrimarySelect";
import { Video } from "lucide-react";
import { useMedia } from "../features/media/hooks/useMedia";
import useChannelManager from "../features/channel/hooks/useChannelManager";

export default function VideoSettings() {
  const { hasVideoPermission } = useMediaStore();
  const { cameras, selectedCamera } = useMediaStore();
  const { getVideoDevices } = useMedia();
  const { switchCamera } = useChannelManager();

  async function handleCameraChange(deviceId: string) {
    const camera = cameras.find((cam) => cam.deviceId === deviceId);

    if (!camera) return console.error("Selected camera not found");

    await switchCamera(camera);
  }

  useEffect(() => {
    if (!hasVideoPermission) return;

    (async () => {
      await getVideoDevices();
    })();
  }, [hasVideoPermission]);

  return (
    <div className="grid gap-1">
      <span className="text-[0.9rem] font-semibold">Cameras</span>
      <PrimarySelect
        placeholder={
          hasVideoPermission ? "Select a device" : "Permission needed"
        }
        disabled={!hasVideoPermission}
        icon={<Video className="text-black" />}
        label="Cameras"
        options={
          hasVideoPermission
            ? cameras.map((cam) => ({
                label: cam.label || "Unnamed Camera",
                value: cam.deviceId || `unknown-${Math.random()}`,
              }))
            : []
        }
        value={selectedCamera?.deviceId}
        onChange={handleCameraChange}
      />
    </div>
  );
}
