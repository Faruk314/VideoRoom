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
          />
        ) : (
          <IconBtn
            showAlert
            description="Microphone not found"
            icon={<MicOff />}
          />
        )}
      </DialogTrigger>

      <DialogContent className="">
        <DialogTitle>Your {type} cannot be found</DialogTitle>

        <p className="text-sm">
          check the settings to make sure the {type} is available. If not, plug
          it in. Then you may need to restart your browser
        </p>
      </DialogContent>
    </Dialog>
  );
}
