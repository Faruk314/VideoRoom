import { useSocket } from "../../../../hooks/useSocket";
import type { IChannelMessage } from "../../types/channelMessages";

export function useChannelMessageEmitters() {
  const { socket } = useSocket();

  async function emitSendChannelMessage(data: {
    channelId: string;
    content: string;
  }): Promise<{ data: IChannelMessage }> {
    return new Promise((resolve, reject) => {
      socket?.emit(
        "sendChannelMessage",
        data,
        (response: {
          error: boolean;
          message?: string;
          data?: IChannelMessage;
        }) => {
          if (response.error || !response.data) {
            return reject(new Error(response.message));
          }

          resolve({
            data: response.data,
          });
        }
      );
    });
  }

  return { emitSendChannelMessage };
}
