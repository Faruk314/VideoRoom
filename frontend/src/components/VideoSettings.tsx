import { useEffect } from "react";
import { useMediaStore } from "../features/media/store/media";
import { PrimarySelect } from "./selects/PrimarySelect";
import { Video } from "lucide-react";
import { useMedia } from "../features/media/hooks/useMedia";

export default function VideoSettings() {
  const { hasVideoPermission } = useMediaStore();
  const { cameras, selectedCamera, setSelectedCamera } = useMediaStore();
  const { getVideoDevices } = useMedia();

  function handleCameraChange(deviceId: string) {
    const camera = cameras.find((cam) => cam.deviceId === deviceId);
    if (camera) setSelectedCamera(camera);
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
