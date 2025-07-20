import { useMediaStore } from "../store/media";

export function useMedia() {
  const { setMicrophones, setAudioPermission } = useMediaStore();
  const { setCameras, setVideoPermission } = useMediaStore();
  const { setSpeakers } = useMediaStore();

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
  }

  async function getMediaStream(deviceId?: string) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        deviceId: deviceId,
      },
    });
    const audioTrack = stream.getAudioTracks()[0];
    const videoTrack = stream.getVideoTracks()[0];

    if (!audioTrack || !videoTrack)
      throw new Error("Missing audio or video track");

    return { stream, audioTrack, videoTrack };
  }

  async function getAudioStream(deviceId?: string) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: deviceId,
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

  async function getMediaPermissions(options: {
    audio?: boolean;
    video?: boolean;
  }) {
    try {
      await navigator.mediaDevices.getUserMedia({
        audio: options.audio ?? false,
        video: options.video ?? false,
      });

      if (options.audio) setAudioPermission(true);

      if (options.video) setVideoPermission(true);
    } catch (error) {
      console.error("Error requesting media permission", error);
    }
  }

  async function hasAvailableDevice(type: "audio" | "video") {
    const kind = type === "audio" ? "audioinput" : "videoinput";
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((device) => device.kind === kind);
  }

  return {
    getAudioDevices,
    getVideoDevices,
    getMediaStream,
    getAudioStream,
    getDisplayStream,
    getMediaPermissions,
    hasAvailableDevice,
  };
}
