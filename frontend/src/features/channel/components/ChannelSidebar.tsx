import { useState } from "react";
import { createPortal } from "react-dom";
import { MessageSquare, X } from "lucide-react";
import { IconBtn } from "../../../components/buttons/IconBtn";
import ChannelChat from "./ChannelChat";
import ChannelChatInput from "./ChannelChatFooter";

export default function ChannelChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const sidebar = (
    <div className="z-100 fixed" onClick={() => setIsOpen(false)}>
      <div
        className={`fixed top-0 right-0 h-full w-[22rem] md:w-[25rem] bg-white shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between p-6">
          <span className="text-xl">Channel Chat</span>
          <button onClick={() => setIsOpen(false)}>
            <X size={30} className="text-black" />
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
        icon={<MessageSquare size={30} />}
        description="Chat"
        className="bg-transparent text-black hover:bg-gray-200"
      />
      {createPortal(sidebar, document.getElementById("root")!)}
    </>
  );
}
