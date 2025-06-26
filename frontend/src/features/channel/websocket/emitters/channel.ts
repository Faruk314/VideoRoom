import { useSocket } from "../../../../hooks/useSocket";

export function useChannelEmitters() {
  const { socket } = useSocket();

  async function emitCreateChannel(): Promise<{
    channelId: string;
    message: string;
  }> {
    return new Promise((resolve, reject) => {
      socket?.emit(
        "createChannel",
        (response: {
          error: boolean;
          message: string;
          data?: { channelId: string };
        }) => {
          if (response.error) {
            return reject(new Error(response.message));
          }

          if (!response.data?.channelId) {
            return reject(new Error("Invalid response: Missing channelId"));
          }

          resolve({
            channelId: response.data.channelId,
            message: response.message,
          });
        }
      );
    });
  }

  return { emitCreateChannel };
}
