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
import classNames from "classnames";

export function Settings() {
  const [activeTab, setActiveTab] = useState<"Audio" | "Video">("Audio");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconBtn description="Settings" icon={<SettingsIcon size={20} />} />
      </DialogTrigger>

      <DialogContent className="w-[95vw] h-[85vh] md:w-full md:max-w-3xl md:h-[600px] bg-[#0B0E14] border border-white/10 text-white p-0 gap-0 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-72 bg-white/[0.02] border-b md:border-b-0 md:border-r border-white/10 flex flex-row md:flex-col p-4 md:p-6 gap-2 md:gap-3 shrink-0 overflow-x-auto md:overflow-visible">
          <div className="hidden md:block mb-4 px-2">
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">
              Settings
            </DialogTitle>
          </div>

          <button
            onClick={() => setActiveTab("Audio")}
            className={classNames(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm md:text-base font-medium whitespace-nowrap md:whitespace-normal flex-1 md:flex-none justify-center md:justify-start",
              activeTab === "Audio"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                : "text-blue-200/60 hover:text-white hover:bg-white/5"
            )}
          >
            <Speaker size={20} />
            <span>Audio</span>
          </button>

          <button
            onClick={() => setActiveTab("Video")}
            className={classNames(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm md:text-base font-medium whitespace-nowrap md:whitespace-normal flex-1 md:flex-none justify-center md:justify-start",
              activeTab === "Video"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                : "text-blue-200/60 hover:text-white hover:bg-white/5"
            )}
          >
            <Video size={20} />
            <span>Video</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#0B0E14] relative overflow-hidden flex flex-col">
          {/* Mobile Header (visible only on small screens) */}
          <div className="md:hidden px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-bold">Settings</DialogTitle>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
            <div className="max-w-2xl mx-auto md:mx-0 space-y-8">
              <div className="flex items-center gap-3 pb-6 border-b border-white/5">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                  {activeTab === "Audio" ? (
                    <Speaker size={24} />
                  ) : (
                    <Video size={24} />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {activeTab} Settings
                  </h2>
                  <p className="text-sm text-blue-200/40">
                    Manage your {activeTab.toLowerCase()} devices and
                    preferences
                  </p>
                </div>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === "Audio" && <AudioSettings />}
                {activeTab === "Video" && <VideoSettings />}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
