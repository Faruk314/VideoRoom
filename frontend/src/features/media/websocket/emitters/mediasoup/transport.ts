import { useSocket } from "../../../../../hooks/useSocket";
import type { RtpCapabilities } from "mediasoup-client/types";

export function useTransportEmitters() {
  const { socket } = useSocket();

  async function emitGetRtpCapabilties(data: { channelId: string }): Promise<{
    routerRtpCapabilities: RtpCapabilities;
    message: string;
  }> {
    return new Promise((resolve, reject) => {
      socket?.emit(
        "getRtpCapabilities",
        data,
        (response: {
          error: boolean;
          message: string;
          data?: { routerRtpCapabilities: RtpCapabilities };
        }) => {
          if (response.error) {
            return reject(new Error(response.message));
          }

          if (!response.data?.routerRtpCapabilities) {
            return reject(
              new Error("Invalid response. Missing router rtp capabilities")
            );
          }

          resolve({
            routerRtpCapabilities: response.data.routerRtpCapabilities,
            message: response.message,
          });
        }
      );
    });
  }

  return { emitGetRtpCapabilties };
}
