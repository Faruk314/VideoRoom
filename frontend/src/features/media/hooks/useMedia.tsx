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

  async function getMediaStream() {
    const selectedCamera = useMediaStore.getState().selectedCamera;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        deviceId: selectedCamera?.deviceId,
      },
    });
    const audioTrack = stream.getAudioTracks()[0];
    const videoTrack = stream.getVideoTracks()[0];

    if (!audioTrack || !videoTrack)
      throw new Error("Missing audio or video track");

    return { stream, audioTrack, videoTrack };
  }

  async function getAudioStream() {
    const selectedMic = useMediaStore.getState().selectedMic;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: selectedMic?.deviceId,
      },
    });
    const audioTrack = stream.getAudioTracks()[0];

    if (!audioTrack) throw new Error("No audio track found");

    return { stream, audioTrack };
  }

  async function getDisplayStream() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    const screenTrack = stream.getVideoTracks()[0];

    if (!screenTrack) throw new Error("No screen track found");

    return { stream, screenTrack };
  }

  return {
    getAudioDevices,
    getVideoDevices,
    getMediaStream,
    getAudioStream,
    getDisplayStream,
  };
}
