import type { ITransport } from "../types/mediasoup";
import type { Device } from "mediasoup-client/types";
import { useMediasoupStore } from "../store/mediasoup";
import { useTransportEmitters } from "../websocket/emitters/mediasoup/transport";
import { useMediaStore } from "../store/media";
import useProducer from "./useProducer";

export default function useTransport() {
  const { setSendTransport, setRecvTransport } = useMediasoupStore();
  const { hasVideoPermission } = useMediaStore();
  const { emitConnectTransport } = useTransportEmitters();
  const { createVideoProducer } = useProducer();

  async function setupSendTransport(transportData: ITransport, device: Device) {
    const clientSendTransport = device.createSendTransport(transportData);

    if (!clientSendTransport)
      throw new Error("Failed to create client sent transport");

    setSendTransport(clientSendTransport);

    clientSendTransport.on("connect", async ({ dtlsParameters }) => {
      try {
        await emitConnectTransport({
          transportId: clientSendTransport.id,
          dtlsParameters,
          type: "send",
        });
      } catch (error) {
        console.error("Failed to connect send transport");
        if (error instanceof Error) throw new Error(error.message);
      }
    });

    clientSendTransport.on("produce", () => {
      try {
        console.log("producer triggered");
      } catch (error) {
        console.error("Failed to create producer on frontend");
        if (error instanceof Error) throw new Error(error.message);
      }
    });

    await createVideoProducer(clientSendTransport);
  }

  function setupRecvTransport(transportData: ITransport, device: Device) {
    const clientRecvTransport = device.createRecvTransport(transportData);

    if (!clientRecvTransport)
      throw new Error("Failed to create client recv transport");

    setRecvTransport(clientRecvTransport);

    clientRecvTransport.on("connect", async ({ dtlsParameters }) => {
      try {
        await emitConnectTransport({
          transportId: clientRecvTransport.id,
          dtlsParameters,
          type: "recv",
        });
      } catch (error) {
        console.error("Failed to connect recv transport");
        if (error instanceof Error) throw new Error(error.message);
      }
    });
  }

  return { setupSendTransport, setupRecvTransport };
}
