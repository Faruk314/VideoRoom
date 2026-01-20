import { useEffect } from "react";
import { useMediaStore } from "../features/media/store/media";
import { PrimarySelect } from "./selects/PrimarySelect";
import { Video } from "lucide-react";
import { useMedia } from "../features/media/hooks/useMedia";
import useVideoManager from "../features/channel/hooks/useVideoManager";

export default function VideoSettings() {
  const { hasVideoPermission } = useMediaStore();
  const { cameras, selectedCamera } = useMediaStore();
  const { getVideoDevices } = useMedia();
  const { switchCamera } = useVideoManager();

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
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium text-blue-200/60 uppercase tracking-wider ml-1">Camera</label>
        <PrimarySelect
          placeholder={
            hasVideoPermission ? "Select a camera" : "Permission needed"
          }
          disabled={!hasVideoPermission}
          icon={<Video size={18} />}
          label="Available Cameras"
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
        <p className="text-xs text-blue-200/30 ml-1">
            Select the camera device for your video feed.
        </p>
      </div>
    </div>
  );
}
