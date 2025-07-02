import { useMediaStore } from "../store/media";

export function useMedia() {
  const { setMicrophones, setSelectedMic } = useMediaStore();
  const { setCameras, setSelectedCamera } = useMediaStore();
  const { setSpeakers, setSelectedSpeaker } = useMediaStore();

  async function getAudioDevices() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const devices = await navigator.mediaDevices.enumerateDevices();

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const microphones = devices.filter((d) => d.kind === "audioinput");
      const speakers = devices.filter((d) => d.kind === "audiooutput");

      setMicrophones(microphones);
      setSpeakers(speakers);

      setSelectedMic(microphones[0]);
      setSelectedSpeaker(speakers[0]);
    } catch (err) {
      console.error("Failed to list audio devices:", err);
    }
  }

  async function getVideoDevices() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    const devices = await navigator.mediaDevices.enumerateDevices();

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    const cameras = devices.filter((d) => d.kind === "videoinput");

    setCameras(cameras);
    setSelectedCamera(cameras[0]);
  }

  return { getAudioDevices, getVideoDevices };
}
