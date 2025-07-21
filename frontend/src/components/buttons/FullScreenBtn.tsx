import { IconBtn } from "./IconBtn";
import { Maximize } from "lucide-react";

export default function FullScreenBtn() {
  function handleFullScreen() {
    const element = document.getElementById("root");

    if (!element) return;

    if (!document.fullscreenElement) {
      element.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  return (
    <IconBtn
      onClick={handleFullScreen}
      description="Fullscreen"
      className="bg-transparent text-black hover:bg-gray-200"
      icon={<Maximize size={30} />}
    />
  );
}
