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
      icon={<Maximize size={20} />}
      className="bg-[#0f1219]/80 backdrop-blur-xl border border-white/10 text-blue-200/70 hover:text-white hover:bg-white/5 shadow-lg"
    />
  );
}
