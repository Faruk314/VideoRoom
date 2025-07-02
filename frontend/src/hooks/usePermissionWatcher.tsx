import { useEffect } from "react";
import { useMediaStore } from "../features/media/store/media";

export default function usePermissionWatcher() {
  const { setAudioPermission, setVideoPermission } = useMediaStore();

  useEffect(() => {
    let audioWatcher: PermissionStatus | null = null;
    let videoWatcher: PermissionStatus | null = null;

    async function setupWatcher() {
      try {
        audioWatcher = await navigator.permissions.query({
          name: "microphone",
        });
        videoWatcher = await navigator.permissions.query({ name: "camera" });

        setAudioPermission(audioWatcher.state === "granted");
        setVideoPermission(videoWatcher.state === "granted");

        audioWatcher.onchange = () => {
          setAudioPermission(audioWatcher?.state === "granted");
        };

        videoWatcher.onchange = () => {
          setVideoPermission(videoWatcher?.state === "granted");
        };
      } catch (error) {
        console.error("Permissions API may not be fully supported", error);
      }
    }

    setupWatcher();

    return () => {
      if (audioWatcher) audioWatcher.onchange = null;
      if (videoWatcher) videoWatcher.onchange = null;
    };
  }, []);
}
