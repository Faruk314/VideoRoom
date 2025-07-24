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

export default function StreamOptions() {
  const [open, setOpen] = useState(false);
  const { stopStream, switchScreenShare } = useChannelManager();

  return (
    <>
      {open && <div className="fixed inset-0" />}

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <IconBtn
            className="bg-black/60 opacity-[0.7] md:h-max md:w-max px-2 py-1 rounded-md slide-up hover:bg-black/50"
            icon={<Ellipsis className="pointer-events-none" />}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 z-50 p-1 rounded-md shadow-lg font-black"
          align="end"
          side="top"
        >
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              stopStream("screen");
            }}
            className="flex justify-between px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
          >
            Stop Stream
            <ScreenShareOff className="text-indigo-600" size={30} />
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              switchScreenShare();
            }}
            className="flex justify-between px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
          >
            Change Stream
            <ScreenShare className="text-indigo-600" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
