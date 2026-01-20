import { useState } from "react";
import { createPortal } from "react-dom";
import { MessageSquare, X } from "lucide-react";
import { IconBtn } from "../../../components/buttons/IconBtn";
import ChannelChat from "./ChannelChat";
import ChannelChatInput from "./ChannelChatFooter";
import classNames from "classnames";

export default function ChannelChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const sidebar = (
    <div
      className={classNames(
        "fixed inset-0 z-[100]",
        {
          "pointer-events-auto": isOpen,
          "pointer-events-none": !isOpen,
        }
      )}
      onClick={() => setIsOpen(false)}
    >
      <div
        className={classNames(
          "fixed top-0 right-0 h-full w-[22rem] md:w-[25rem] bg-[#0f1219]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl transform transition-transform duration-300 flex flex-col text-white pointer-events-auto",
          {
            "translate-x-0": isOpen,
            "translate-x-full": !isOpen,
          }
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <span className="text-xl font-bold tracking-tight">Channel Chat</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/70 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <ChannelChat />

        <ChannelChatInput />
      </div>
    </div>
  );

  return (
    <>
      <IconBtn
        onClick={() => {
          setIsOpen(true);
        }}
        icon={<MessageSquare size={20} />}
        description="Chat"
        className="bg-[#0f1219]/80 backdrop-blur-xl border border-white/10 text-blue-200/70 hover:text-white hover:bg-white/5 shadow-lg"
      />
      {createPortal(sidebar, document.getElementById("root")!)}
    </>
  );
}
