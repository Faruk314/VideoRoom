import { Check, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { IconBtn } from "../buttons/IconBtn";
import { useState } from "react";
import classNames from "classnames";
import { useLocalParticipantStore } from "../../features/channel/store/localParticipant";
import useAudioManager from "../../features/channel/hooks/useAudioManager";
import useVideoManager from "../../features/channel/hooks/useVideoManager";

export default function UserOptions() {
  const [open, setOpen] = useState(false);
  const { localParticipant } = useLocalParticipantStore();
  const { toogleMicrophone } = useAudioManager();
  const { toogleCamera } = useVideoManager();
  const camMuted = localParticipant?.camMuted;
  const micMuted = localParticipant?.micMuted;

  return (
    <>
      {open && <div className="fixed inset-0 z-40" />}

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <IconBtn
            className="bg-black/60 opacity-[0.7] h-7 w-9 md:h-8 md:w-9 rounded-md slide-up hover:bg-black/30 border-none shadow-none"
            description="Options"
            icon={<Ellipsis className="pointer-events-none" size={18} />}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 z-50 p-1 rounded-xl shadow-2xl bg-[#0f1219]/95 backdrop-blur-xl border border-white/10 text-white"
          align="end"
          side="top"
        >
          {[
            {
              label: "Mute",
              selected: micMuted,
              onClick: toogleMicrophone,
            },
            {
              label: "Enable camera",
              selected: !camMuted,
              onClick: toogleCamera,
            },
          ].map(({ label, selected, onClick }) => (
            <DropdownMenuItem
              key={label}
              onSelect={(e) => {
                e.preventDefault();
                onClick();
              }}
              className="relative flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-colors"
            >
              <p className="font-bold">{label}</p>
              <div
                className={classNames(
                  "w-5 h-5 flex items-center justify-center rounded-md border transition-all duration-200",
                  {
                    "bg-blue-600 border-blue-600": selected,
                    "border-white/30": !selected,
                  }
                )}
              >
                {selected && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
