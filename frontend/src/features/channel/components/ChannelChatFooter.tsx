import { Send } from "lucide-react";
import { ChatInput } from "../../../components/inputs/ChatInput";
import { IconBtn } from "../../../components/buttons/IconBtn";
import { useCreateChannelMessageMutation } from "../queries/channelMessages";
import { useChannelStore } from "../store/channel";
import { useState } from "react";

export default function ChannelChatInput() {
  const [message, setMessage] = useState("");
  const createMessageMutation = useCreateChannelMessageMutation();
  const currentChannel = useChannelStore((state) => state.currentChannel);

  function handleSubmit() {
    if (!message.trim() || !currentChannel?.id) return;

    createMessageMutation.mutate(
      {
        content: message,
        channelId: currentChannel.id,
      },
      {
        onSuccess: () => {
          setMessage("");
        },
      }
    );
  }

  return (
    <div className="flex space-x-2 pb-4 px-4 pt-2">
      <div className="rounded-2xl border border-white/10 p-3 bg-white/5 w-full focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
        <ChatInput
          placeholder={`Type a message...`}
          className="flex-1 resize-none border-none self-center p-0 bg-transparent text-white placeholder-blue-200/30 focus:outline-none focus:ring-0 max-h-32 overflow-y-auto"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
      </div>

      <IconBtn
        onClick={handleSubmit}
        icon={<Send size={20} />}
        className="h-12 w-12 md:h-12 md:w-12 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 border border-blue-400/20"
      />
    </div>
  );
}
