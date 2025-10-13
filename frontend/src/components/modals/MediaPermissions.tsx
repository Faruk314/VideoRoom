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
          />
        ) : (
          <IconBtn
            showAlert
            description="Audio permission needed"
            icon={<MicOff />}
          />
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <img
          className="md:h-55 md:w-80 mx-auto"
          src="/images/audioVideo.webp"
        />

        <div className="flex flex-col items-center gap-2">
          <DialogTitle className="text-xl font-semibold text-center">
            You want others to hear you during the meeting?
          </DialogTitle>

          <p className="text-[0.9rem] text-center md:text-left">
            you can turn on the microphone at any time during the meeting
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 mt-5">
          {type === "audio" ? (
            <PrimaryBtn
              className="w-70"
              onClick={() => handlePermissions("audio")}
            >
              Enable Microphone
            </PrimaryBtn>
          ) : (
            <PrimaryBtn
              className="w-70"
              onClick={() => handlePermissions("video")}
            >
              Enable Camera
            </PrimaryBtn>
          )}

          <PrimaryBtn
            className="w-70"
            onClick={() => handlePermissions("combined")}
          >
            Enable mic and camera
          </PrimaryBtn>
        </div>
      </DialogContent>
    </Dialog>
  );
}
