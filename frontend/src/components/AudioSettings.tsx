import { Mic, Volume2 } from "lucide-react";
import { useMediaStore } from "../features/media/store/media";
import { PrimarySelect } from "./selects/PrimarySelect";
import { useEffect } from "react";
import { useMedia } from "../features/media/hooks/useMedia";
import useChannelManager from "../features/channel/hooks/useChannelManager";

export default function AudioSettings() {
  const { hasAudioPermission } = useMediaStore();
  const { microphones, selectedMic } = useMediaStore();
  const { speakers, selectedSpeaker, setSelectedSpeaker } = useMediaStore();
  const { getAudioDevices } = useMedia();
  const { switchMicrophone } = useChannelManager();

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
    <>
      <div className="grid gap-1">
        <span className="text-[0.9rem] font-semibold">Microphones</span>
        <PrimarySelect
          placeholder={
            hasAudioPermission ? "Select a device" : "Permission needed"
          }
          disabled={!hasAudioPermission}
          icon={<Mic className="text-black" />}
          label="Microphones"
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
      </div>

      <div className="grid gap-1">
        <span className="text-[0.9rem] font-semibold">Speakers</span>
        <PrimarySelect
          placeholder={
            hasAudioPermission ? "Select a device" : "Permission needed"
          }
          disabled={!hasAudioPermission}
          icon={<Volume2 className="text-black" />}
          label="Speakers"
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
      </div>
    </>
  );
}
