import type { types } from "mediasoup-client";
import { useSocket } from "../../../../../hooks/useSocket";

export default function useProducerEmitters() {
  const { socket } = useSocket();

  async function emitCreateProducer(data: {
    transportId: string;
    kind: types.MediaKind;
    rtpParameters: types.RtpParameters;
    appData: types.AppData;
  }): Promise<{
    producerId: string;
    message: string;
  }> {
    return new Promise((resolve, reject) => {
      socket?.emit(
        "createProducer",
        data,
        (response: {
          error: boolean;
          message: string;
          data?: { producerId: string };
        }) => {
          if (response.error) {
            return reject(new Error(response.message));
          }

          if (!response.data?.producerId) {
            return reject(
              new Error("Invalid response. Missing producer id from backend")
            );
          }

          resolve({
            producerId: response.data.producerId,
            message: response.message,
          });
        }
      );
    });
  }

  async function emitCloseProducer(data: { producerId: string }): Promise<{
    producerId: string;
    message: string;
  }> {
    return new Promise((resolve, reject) => {
      socket?.emit(
        "closeProducer",
        data,
        (response: {
          error: boolean;
          message: string;
          data?: { producerId: string };
        }) => {
          if (response.error) {
            return reject(new Error(response.message));
          }

          if (!response.data?.producerId) {
            return reject(
              new Error("Invalid response. Missing producer id from backend")
            );
          }

          resolve({
            producerId: response.data.producerId,
            message: response.message,
          });
        }
      );
    });
  }

  return { emitCreateProducer, emitCloseProducer };
}
