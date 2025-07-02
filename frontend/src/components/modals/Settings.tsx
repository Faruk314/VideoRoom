import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { Video, Settings as SettingsIcon, Speaker } from "lucide-react";
import { IconBtn } from "../buttons/IconBtn";
import { useState } from "react";
import AudioSettings from "../AudioSettings";
import VideoSettings from "../VideoSettings";

export function Settings() {
  const [activeTab, setActiveTab] = useState<"Audio" | "Video">("Audio");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconBtn description="Settings" icon={<SettingsIcon />} />
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogTitle className="text-2xl font-semibold">Settings</DialogTitle>

        <div className="grid md:grid-cols-2 h-[300px]">
          <div className="flex flex-col gap-2 pr-4">
            <button
              onClick={() => setActiveTab("Audio")}
              className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition ${
                activeTab === "Audio" ? "bg-gray-100 font-medium" : ""
              }`}
            >
              <Speaker />
              <span>Audio</span>
            </button>

            <button
              onClick={() => setActiveTab("Video")}
              className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition ${
                activeTab === "Video" ? "bg-gray-100 font-medium" : ""
              }`}
            >
              <Video />
              <span>Video</span>
            </button>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto">
            {activeTab === "Audio" && <AudioSettings />}
            {activeTab === "Video" && <VideoSettings />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
