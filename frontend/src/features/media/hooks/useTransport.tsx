import type { ITransport } from "../types/mediasoup";
import type { Device } from "mediasoup-client/types";
import { useMediasoupStore } from "../store/mediasoup";

export default function useTransport() {
  const { setSendTransport, setRecvTransport } = useMediasoupStore();

  function setupSendTransport(transportData: ITransport, device: Device) {
    const clientSendTransport = device.createSendTransport(transportData);

    if (!clientSendTransport)
      throw new Error("Failed to create client sent transport");

    setSendTransport(clientSendTransport);

    clientSendTransport.on("connect", () => {});

    clientSendTransport.on("produce", () => {});
  }

  function setupRecvTransport(transportData: ITransport, device: Device) {
    const clientRecvTransport = device.createRecvTransport(transportData);

    if (!clientRecvTransport)
      throw new Error("Failed to create client recv transport");

    setRecvTransport(clientRecvTransport);

    clientRecvTransport.on("connect", () => {});
  }

  return { setupSendTransport, setupRecvTransport };
}
