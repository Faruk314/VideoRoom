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
import useChannelManager from "../../features/channel/hooks/useChannelManager";

export default function UserOptions() {
  const [open, setOpen] = useState(false);

  const { localParticipant, updateLocalParticipant } =
    useLocalParticipantStore();
  const { toogleCamera } = useChannelManager();

  const camMuted = localParticipant?.camMuted;
  const micMuted = localParticipant?.micMuted;

  const toggleAudio = () => updateLocalParticipant({});

  return (
    <>
      {open && <div className="fixed inset-0 z-40" />}

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <IconBtn
            className="bg-black/60 opacity-[0.7] md:h-max md:w-max px-2 py-1 rounded-md slide-up hover:bg-black/30"
            icon={<Ellipsis />}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 z-50 p-1 rounded-md shadow-lg"
          align="end"
          side="top"
        >
          {[
            {
              label: "Mute audio",
              selected: micMuted,
              onClick: toggleAudio,
            },
            {
              label: "Disable video",
              selected: camMuted,
              onClick: toogleCamera,
            },
          ].map(({ label, selected, onClick }) => (
            <DropdownMenuItem
              key={label}
              onSelect={(e) => {
                e.preventDefault();
                onClick();
              }}
              className="relative flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-sm hover:bg-gray-100 focus:bg-gray-100"
            >
              <p className="font-black">{label}</p>
              <div
                className={classNames(
                  "w-5 h-5 flex items-center justify-center rounded-sm border border-gray-400 transition-all duration-200",
                  {
                    "bg-indigo-600 border-indigo-600": selected,
                  }
                )}
              >
                {selected && <Check className="w-4 h-4 text-white" />}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
