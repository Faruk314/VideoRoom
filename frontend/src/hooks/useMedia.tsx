import { useMediaStore } from "../store/media";

export function useMedia() {
  const { setMicrophones, setSelectedMic } = useMediaStore();
  const { setCameras, setSelectedCamera } = useMediaStore();
  const { setSpeakers, setSelectedSpeaker } = useMediaStore();

  async function listDevices() {
    let audioStream = null;
    let videoStream = null;

    try {
      try {
        audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      } catch (audioError) {
        console.error("Could not get audio stream");
      }

      try {
        videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
      } catch (videoError) {
        console.error("Could not get video stream:");
      }

      const devices = await navigator.mediaDevices.enumerateDevices();

      const audioInputs = devices.filter((d) => d.kind === "audioinput");
      const audioOutputs = devices.filter((d) => d.kind === "audiooutput");
      const videoInputs = devices.filter((d) => d.kind === "videoinput");

      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }

      return {
        microphones: audioInputs,
        speakers: audioOutputs,
        cameras: videoInputs,
      };
    } catch (generalError) {
      throw new Error("Error listing media devices");
    } finally {
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    }
  }

  async function setDevices() {
    const data = await listDevices();

    if (!data) return;

    setSelectedCamera(data.cameras[0]);
    setCameras(data.cameras);

    setSelectedMic(data.microphones[0]);
    setMicrophones(data.microphones);

    setSelectedSpeaker(data.speakers[0]);
    setSpeakers(data.speakers);
  }

  return { setDevices };
}
