import classNames from "classnames";
import { useChannelStore } from "../../features/channel/store/channel";
import { ChevronDown, ChevronUp, Users } from "lucide-react";
import { useState } from "react";

export default function HideParticipantsBtn() {
  const [isHoveringBtn, setIsHoveringBtn] = useState(false);

  const { participantsHidden, setParticipantsVisibility, isHovering } =
    useChannelStore();

  function toogleParticipantsVisibility() {
    setIsHoveringBtn(false);
    setParticipantsVisibility(!participantsHidden);
  }

  return (
    <div
      className={classNames("absolute left-1/2 -translate-x-1/2", {
        "top-[-6rem]": participantsHidden,
        "top-[-13rem]": !participantsHidden,
      })}
    >
      <button
        onMouseOver={() => setIsHoveringBtn(true)}
        onMouseLeave={() => setIsHoveringBtn(false)}
        onClick={toogleParticipantsVisibility}
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
      {isHoveringBtn && (
        <span className="absolute font-black bottom-full left-1/2 mb-2 -translate-x-1/2 bg-black/60 text-white rounded px-2 py-1 whitespace-nowrap">
          {participantsHidden ? "Show Participants" : "Hide Participants"}
        </span>
      )}
    </div>
  );
}
