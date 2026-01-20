import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { IconBtn } from "../buttons/IconBtn";
import { ScreenShare, ScreenShareOff } from "lucide-react";
import { useState } from "react";
import useChannelManager from "../../features/channel/hooks/useChannelManager";
import useScreenShareManager from "../../features/channel/hooks/useScreenShareManager";

export default function StreamOptions() {
  const [open, setOpen] = useState(false);
  const { stopStream } = useChannelManager();
  const { switchScreenShare } = useScreenShareManager();

  return (
    <>
      {open && <div className="fixed inset-0 z-40" />}

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <IconBtn
            className="bg-black/60 opacity-[0.7] h-7 w-9 md:h-8 md:w-9 rounded-md slide-up hover:bg-black/50 border-none shadow-none"
            icon={<Ellipsis className="pointer-events-none" size={18} />}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 z-50 p-1 rounded-xl shadow-2xl font-bold bg-[#0f1219]/95 backdrop-blur-xl border border-white/10 text-white"
          align="end"
          side="top"
        >
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              stopStream("screen");
            }}
            className="flex justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
          >
            <span>Stop Stream</span>
            <ScreenShareOff className="text-red-400" size={18} />
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              switchScreenShare();
            }}
            className="flex justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
          >
            <span>Change Stream</span>
            <ScreenShare className="text-blue-400" size={18} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
