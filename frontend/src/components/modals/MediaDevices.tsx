import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PrimarySelect } from "../selects/PrimarySelect";
import { useMediaStore } from "../../features/media/store/media";
import { Mic, Volume2, Video, Settings } from "lucide-react";
import { IconBtn } from "../buttons/IconBtn";

export function MediaDevices() {
  const { microphones, selectedMic, setSelectedMic } = useMediaStore();
  const { cameras, selectedCamera, setSelectedCamera } = useMediaStore();
  const { speakers, selectedSpeaker, setSelectedSpeaker } = useMediaStore();

  function handleMicChange(deviceId: string) {
    const mic = microphones.find((mic) => mic.deviceId === deviceId);
    if (mic) setSelectedMic(mic);
  }

  function handleCameraChange(deviceId: string) {
    const camera = cameras.find((cam) => cam.deviceId === deviceId);
    if (camera) setSelectedCamera(camera);
  }

  function handleSpeakerChange(deviceId: string) {
    const speaker = speakers.find((s) => s.deviceId === deviceId);

    if (speaker) setSelectedSpeaker(speaker);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconBtn icon={<Settings />} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Media devices</DialogTitle>
          <DialogDescription>
            Make changes to your media devices here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-7">
          <div className="grid gap-1">
            <span className="text-[0.9rem] font-semibold">Microphones</span>
            <PrimarySelect
              icon={<Mic className="text-black" />}
              label="Microphones"
              options={microphones.map((m) => ({
                label: m.label || "Unnamed Microphone",
                value: m.deviceId,
              }))}
              value={selectedMic?.deviceId}
              onChange={handleMicChange}
            />
          </div>

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

          <div className="grid gap-1">
            <span className="text-[0.9rem] font-semibold">Speakers</span>
            <PrimarySelect
              icon={<Volume2 className="text-black" />}
              label="Speakers"
              options={speakers.map((m) => ({
                label: m.label || "Unnamed Speaker",
                value: m.deviceId,
              }))}
              value={selectedSpeaker?.deviceId}
              onChange={handleSpeakerChange}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
