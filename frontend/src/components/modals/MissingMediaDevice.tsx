import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { IconBtn } from "../buttons/IconBtn";
import { MicOff, VideoOff } from "lucide-react";

interface Props {
  type: "camera" | "microphone";
}

export default function MissingMediaDevice({ type }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "camera" ? (
          <IconBtn
            showAlert
            description="Camera not found"
            icon={<VideoOff />}
            className="bg-[#0f1219]/80 backdrop-blur-xl border border-white/10 text-blue-200/70 hover:text-white hover:bg-white/5 shadow-lg"
          />
        ) : (
          <IconBtn
            showAlert
            description="Microphone not found"
            icon={<MicOff />}
            className="bg-[#0f1219]/80 backdrop-blur-xl border border-white/10 text-blue-200/70 hover:text-white hover:bg-white/5 shadow-lg"
          />
        )}
      </DialogTrigger>

      <DialogContent className="bg-[#0f1219]/95 backdrop-blur-2xl border border-white/10 text-white">
        <DialogTitle className="text-xl font-bold tracking-tight text-red-400">Your {type} cannot be found</DialogTitle>

        <p className="text-sm text-blue-200/70 leading-relaxed font-medium">
          Check the settings to make sure the {type} is available. If not, plug
          it in. Then you may need to restart your browser.
        </p>
      </DialogContent>
    </Dialog>
  );
}
