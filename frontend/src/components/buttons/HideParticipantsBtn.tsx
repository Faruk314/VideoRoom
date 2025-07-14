import classNames from "classnames";
import { useChannelStore } from "../../features/channel/store/channel";
import { ChevronDown, ChevronUp, Users } from "lucide-react";

export default function HideParticipantsBtn() {
  const { participantsHidden, setParticipantsVisibility, isHovering } =
    useChannelStore();

  function toogleParticipantsVisibility() {
    setParticipantsVisibility(!participantsHidden);
  }

  return (
    <button
      onClick={toogleParticipantsVisibility}
      className={classNames(
        "absolute left-1/2 -translate-x-1/2 top-[-1rem] flex items-center space-x-2 text-white rounded-full py-1 px-2 cursor-pointer bg-black/60 hover:bg-black/50",
        {
          hidden: !isHovering,
          "top-[-15rem]": !participantsHidden,
        }
      )}
    >
      {participantsHidden ? <ChevronDown size={22} /> : <ChevronUp size={22} />}
      <Users fill="white" size={22} />
    </button>
  );
}
