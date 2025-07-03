import { useCallback } from "react";
import useTransport from "../../media/hooks/useTransport";
import { useMediasoupStore } from "../../media/store/mediasoup";
import { useTransportEmitters } from "../../media/websocket/emitters/mediasoup/transport";
import { Device } from "mediasoup-client";

export default function useParticipant() {
  const { emitGetRtpCapabilties, emitCreateTransport } = useTransportEmitters();
  const { setDevice } = useMediasoupStore();
  const { setupSendTransport, setupRecvTransport } = useTransport();

  const connectMediasoup = useCallback(async (channelId: string) => {
    try {
      const { routerRtpCapabilities } = await emitGetRtpCapabilties({
        channelId,
      });

      const device = new Device();

      await device.load({ routerRtpCapabilities });

      setDevice(device);

      const { sendTransport, recvTransport } = await emitCreateTransport();

      await Promise.all([
        setupSendTransport(sendTransport, device),
        setupRecvTransport(recvTransport, device),
      ]);
    } catch (error) {
      console.error("Failed to connect with mediasoup server");

      if (error instanceof Error) throw new Error(error.message);
    }
  }, []);

  return { connectMediasoup };
}
