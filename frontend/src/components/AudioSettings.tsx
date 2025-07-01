import { Mic, Volume2 } from "lucide-react";
import { useMediaStore } from "../features/media/store/media";
import { PrimarySelect } from "./selects/PrimarySelect";

export default function AudioSettings() {
  const { microphones, selectedMic, setSelectedMic } = useMediaStore();
  const { speakers, selectedSpeaker, setSelectedSpeaker } = useMediaStore();

  function handleMicChange(deviceId: string) {
    const mic = microphones.find((mic) => mic.deviceId === deviceId);
    if (mic) setSelectedMic(mic);
  }

  function handleSpeakerChange(deviceId: string) {
    const speaker = speakers.find((s) => s.deviceId === deviceId);

    if (speaker) setSelectedSpeaker(speaker);
  }

  return (
    <>
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
    </>
  );
}
