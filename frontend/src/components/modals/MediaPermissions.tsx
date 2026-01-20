import { MicOff, VideoOff } from "lucide-react";
import { IconBtn } from "../buttons/IconBtn";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PrimaryBtn } from "../buttons/PrimaryBtn";
import { useState } from "react";
import { useMedia } from "../../features/media/hooks/useMedia";

interface Props {
  type: "video" | "audio";
}

export default function MediaPermissions({ type }: Props) {
  const [open, setOpen] = useState(false);
  const { getMediaPermissions } = useMedia();

  async function handlePermissions(
    permissionType: "audio" | "video" | "combined"
  ) {
    if (permissionType === "audio") {
      await getMediaPermissions({ audio: true });
    } else if (permissionType === "video") {
      await getMediaPermissions({ video: true });
    } else {
      await getMediaPermissions({ audio: true, video: true });
    }

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "video" ? (
          <IconBtn
            showAlert
            description="Video permission needed"
            icon={<VideoOff />}
            className="bg-[#0f1219]/80 backdrop-blur-xl border border-white/10 text-blue-200/70 hover:text-white hover:bg-white/5 shadow-lg"
          />
        ) : (
          <IconBtn
            showAlert
            description="Audio permission needed"
            icon={<MicOff />}
            className="bg-[#0f1219]/80 backdrop-blur-xl border border-white/10 text-blue-200/70 hover:text-white hover:bg-white/5 shadow-lg"
          />
        )}
      </DialogTrigger>

      <DialogContent className="max-w-xl bg-[#0f1219]/95 backdrop-blur-2xl border border-white/10 text-white">
        <div className="flex flex-col items-center gap-2 pt-4">
          <DialogTitle className="text-xl font-bold text-center tracking-tight">
            Allow {type === "video" ? "Camera" : "Microphone"} Access
          </DialogTitle>

          <p className="text-[0.95rem] text-center text-blue-200/70 font-medium">
            We need your permission to use your {type === "video" ? "camera" : "microphone"} for the meeting.
            You can turn it off at any time.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 mt-6 w-full">
          {type === "audio" ? (
            <PrimaryBtn
              className="w-full shadow-lg"
              onClick={() => handlePermissions("audio")}
            >
              Enable Microphone
            </PrimaryBtn>
          ) : (
            <PrimaryBtn
              className="w-full shadow-lg"
              onClick={() => handlePermissions("video")}
            >
              Enable Camera
            </PrimaryBtn>
          )}

          <PrimaryBtn
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-blue-200 shadow-none hover:shadow-lg"
            onClick={() => handlePermissions("combined")}
          >
            Enable both mic and camera
          </PrimaryBtn>
        </div>
      </DialogContent>
    </Dialog>
  );
}
