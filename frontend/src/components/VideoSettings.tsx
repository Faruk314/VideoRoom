import { useMediaStore } from "../features/media/store/media";
import { PrimarySelect } from "./selects/PrimarySelect";
import { Video } from "lucide-react";

export default function VideoSettings() {
  const { cameras, selectedCamera, setSelectedCamera } = useMediaStore();

  function handleCameraChange(deviceId: string) {
    const camera = cameras.find((cam) => cam.deviceId === deviceId);
    if (camera) setSelectedCamera(camera);
  }

  return (
    <div className="grid gap-1">
      <span className="text-[0.9rem] font-semibold">Cameras</span>
      <PrimarySelect
        icon={<Video className="text-black" />}
        label="Cameras"
        options={cameras.map((m) => ({
          label: m.label || "Unnamed Camera",
          value: m.deviceId,
        }))}
        value={selectedCamera?.deviceId}
        onChange={handleCameraChange}
      />
    </div>
  );
}
