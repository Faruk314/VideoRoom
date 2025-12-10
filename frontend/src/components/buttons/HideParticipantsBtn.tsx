import classNames from "classnames";
import { useChannelStore } from "../../features/channel/store/channel";
import { ChevronDown, ChevronUp, Users } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../../components/ui/tooltip";
import { useChannelHoverStore } from "../../features/channel/store/channelHover";

export default function HideParticipantsBtn() {
  const { participantsHidden, setParticipantsVisibility } = useChannelStore();
  const isHovering = useChannelHoverStore((state) => state.isHovering);

  function toggleParticipantsVisibility() {
    setParticipantsVisibility(!participantsHidden);
  }

  return (
    <div
      className={classNames("absolute left-1/2 -translate-x-1/2", {
        "top-[-6rem]": participantsHidden,
        "top-[-13rem]": !participantsHidden,
      })}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleParticipantsVisibility}
            className={classNames(
              "flex items-center space-x-2 text-white rounded-full py-1 px-2 cursor-pointer bg-black/60 hover:bg-black/50",
              {
                hidden: !isHovering,
              }
            )}
          >
            {participantsHidden ? (
              <ChevronUp size={22} />
            ) : (
              <ChevronDown size={22} />
            )}
            <Users fill="white" size={22} />
          </button>
        </TooltipTrigger>

        <TooltipContent
          side="top"
          sideOffset={8}
          className="px-4 py-1 text-[0.9rem] font-black"
        >
          {participantsHidden ? "Show Participants" : "Hide Participants"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
