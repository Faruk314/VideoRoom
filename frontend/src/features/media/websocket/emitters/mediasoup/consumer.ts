import type { types } from "mediasoup-client";
import { useSocket } from "../../../../../hooks/useSocket";

export default function useConsumerEmitters() {
  const { socket } = useSocket();

  async function emitCreateConsumer(data: {
    recvTransportId: string;
    producerId: string;
    rtpCapabilities: types.RtpCapabilities;
  }): Promise<{
    data: {
      id: string;
      producerId: string;
      kind: types.MediaKind;
      rtpParameters: types.RtpParameters;
      appData: types.AppData;
    };
    message: string;
  }> {
    return new Promise((resolve, reject) => {
      socket?.emit(
        "createConsumer",
        data,
        (response: {
          error: boolean;
          message: string;
          data?: {
            id: string;
            producerId: string;
            kind: types.MediaKind;
            rtpParameters: types.RtpParameters;
            appData: types.AppData;
          };
        }) => {
          if (response.error) {
            return reject(new Error(response.message));
          }

          if (!response.data) {
            return reject(
              new Error("Invalid response. Missing consumer data from backend")
            );
          }

          resolve({
            data: response.data,
            message: response.message,
          });
        }
      );
    });
  }

  async function emitCreateConsumers(data: {
    rtpCapabilities: types.RtpCapabilities;
  }): Promise<{
    data: {
      id: string;
      producerId: string;
      kind: types.MediaKind;
      rtpParameters: types.RtpParameters;
      appData: types.AppData;
      userId: string;
    }[];
    message: string;
  }> {
    return new Promise((resolve, reject) => {
      socket?.emit(
        "createConsumers",
        data,
        (response: {
          error: boolean;
          message: string;
          data?: {
            id: string;
            producerId: string;
            kind: types.MediaKind;
            rtpParameters: types.RtpParameters;
            appData: types.AppData;
            userId: string;
          }[];
        }) => {
          if (response.error) {
            return reject(new Error(response.message));
          }

          if (!response.data) {
            return reject(
              new Error(
                "Invalid response. Missing consumers array from backend"
              )
            );
          }

          resolve({
            data: response.data,
            message: response.message,
          });
        }
      );
    });
  }

  return { emitCreateConsumer, emitCreateConsumers };
}
