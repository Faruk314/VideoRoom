import { Mic, Volume2 } from "lucide-react";
import { useMediaStore } from "../features/media/store/media";
import { PrimarySelect } from "./selects/PrimarySelect";
import { useEffect } from "react";
import { useMedia } from "../features/media/hooks/useMedia";
import useAudioManager from "../features/channel/hooks/useAudioManager";

export default function AudioSettings() {
  const { hasAudioPermission } = useMediaStore();
  const { microphones, selectedMic } = useMediaStore();
  const { speakers, selectedSpeaker, setSelectedSpeaker } = useMediaStore();
  const { getAudioDevices } = useMedia();
  const { switchMicrophone } = useAudioManager();

  async function handleMicChange(deviceId: string) {
    const mic = microphones.find((mic) => mic.deviceId === deviceId);

    if (!mic) return console.error("Selected microphone not found");

    await switchMicrophone(mic);
  }

  function handleSpeakerChange(deviceId: string) {
    const speaker = speakers.find((s) => s.deviceId === deviceId);

    if (speaker) setSelectedSpeaker(speaker);
  }

  useEffect(() => {
    if (!hasAudioPermission) return;

    (async () => {
      await getAudioDevices();
    })();
  }, [hasAudioPermission]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium text-blue-200/60 uppercase tracking-wider ml-1">Microphone</label>
        <PrimarySelect
          placeholder={
            hasAudioPermission ? "Select a microphone" : "Permission needed"
          }
          disabled={!hasAudioPermission}
          icon={<Mic size={18} />}
          label="Available Microphones"
          options={
            hasAudioPermission
              ? microphones.map((m) => ({
                  label: m.label || "Unnamed Microphone",
                  value: m.deviceId,
                }))
              : []
          }
          value={selectedMic?.deviceId}
          onChange={handleMicChange}
        />
        <p className="text-xs text-blue-200/30 ml-1">
            Select the input device you want to use for speaking.
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-blue-200/60 uppercase tracking-wider ml-1">Speaker</label>
        <PrimarySelect
          placeholder={
            hasAudioPermission ? "Select a speaker" : "Permission needed"
          }
          disabled={!hasAudioPermission}
          icon={<Volume2 size={18} />}
          label="Available Speakers"
          options={
            hasAudioPermission
              ? speakers.map((s) => ({
                  label: s.label || "Unnamed Speaker",
                  value: s.deviceId,
                }))
              : []
          }
          value={selectedSpeaker?.deviceId}
          onChange={handleSpeakerChange}
        />
        <p className="text-xs text-blue-200/30 ml-1">
            Select the output device for hearing other participants.
        </p>
      </div>
    </div>
  );
}
