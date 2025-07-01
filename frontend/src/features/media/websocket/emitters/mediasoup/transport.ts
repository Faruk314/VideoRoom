import { useSocket } from "../../../../../hooks/useSocket";
import type { RtpCapabilities } from "mediasoup-client/types";
import type { ITransport } from "../../../types/mediasoup";

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

  async function emitCreateTransport(): Promise<{
    sendTransport: ITransport;
    recvTransport: ITransport;
    message: string;
  }> {
    return new Promise((resolve, reject) => {
      socket?.emit(
        "createTransport",
        (response: {
          error: boolean;
          message: string;
          data?: { sendTransport: ITransport; recvTransport: ITransport };
        }) => {
          if (response.error) {
            return reject(new Error(response.message));
          }

          if (!response.data?.sendTransport || !response.data.recvTransport) {
            return reject(new Error("Invalid response. Missing transport"));
          }

          resolve({
            sendTransport: response.data.sendTransport,
            recvTransport: response.data.recvTransport,
            message: response.message,
          });
        }
      );
    });
  }

  return { emitGetRtpCapabilties, emitCreateTransport };
}
