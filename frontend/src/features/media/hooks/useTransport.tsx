import type { ITransport } from "../types/mediasoup";
import type { Device } from "mediasoup-client/types";
import { useMediasoupStore } from "../store/mediasoup";
import { useTransportEmitters } from "../websocket/emitters/mediasoup/transport";
import { useMediaStore } from "../store/media";
import useProducer from "./useProducer";
import useProducerEmitters from "../websocket/emitters/mediasoup/producer";

export default function useTransport() {
  const { setSendTransport, setRecvTransport } = useMediasoupStore();
  const { hasVideoPermission } = useMediaStore();
  const { emitConnectTransport } = useTransportEmitters();
  const { emitCreateProducer } = useProducerEmitters();
  const { createVideoProducer } = useProducer();

  async function setupSendTransport(transportData: ITransport, device: Device) {
    const clientSendTransport = device.createSendTransport(transportData);

    if (!clientSendTransport)
      throw new Error("Failed to create client sent transport");

    setSendTransport(clientSendTransport);

    clientSendTransport.on("connect", async ({ dtlsParameters }, callback) => {
      try {
        await emitConnectTransport({
          transportId: clientSendTransport.id,
          dtlsParameters,
          type: "send",
        });

        callback();
      } catch (error) {
        console.error("Failed to connect send transport");
        if (error instanceof Error) throw new Error(error.message);
      }
    });

    clientSendTransport.on(
      "produce",
      async ({ kind, rtpParameters, appData }, callback) => {
        try {
          const { producerId } = await emitCreateProducer({
            transportId: clientSendTransport.id,
            kind,
            rtpParameters,
            appData,
          });

          callback({ id: producerId });
        } catch (error) {
          console.error("Failed to create producer on frontend");
          if (error instanceof Error) throw new Error(error.message);
        }
      }
    );

    await createVideoProducer(clientSendTransport);
  }

  function setupRecvTransport(transportData: ITransport, device: Device) {
    const clientRecvTransport = device.createRecvTransport(transportData);

    if (!clientRecvTransport)
      throw new Error("Failed to create client recv transport");

    setRecvTransport(clientRecvTransport);

    clientRecvTransport.on("connect", async ({ dtlsParameters }, callback) => {
      try {
        await emitConnectTransport({
          transportId: clientRecvTransport.id,
          dtlsParameters,
          type: "recv",
        });

        callback();
      } catch (error) {
        console.error("Failed to connect recv transport");

        if (error instanceof Error) throw new Error(error.message);
      }
    });
  }

  return { setupSendTransport, setupRecvTransport };
}
