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
    <div className="flex space-x-2 pb-2 px-2">
      <div className="rounded-md border border-gray-300 p-3 bg-white w-full">
        <ChatInput
          placeholder={`Send message`}
          className="flex-1 resize-none border-none self-center p-0"
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
        className="h-12 w-12 md:h-12 md:w-12 rounded-xl"
      />
    </div>
  );
}
