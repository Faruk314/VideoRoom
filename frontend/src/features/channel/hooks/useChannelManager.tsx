import { useCallback } from "react";
import useTransport from "../../media/hooks/useTransport";
import { useMediasoupStore } from "../../media/store/mediasoup";
import { useTransportEmitters } from "../../media/websocket/emitters/mediasoup/transport";
import { Device } from "mediasoup-client";
import { useLocalParticipantStore } from "../store/localParticipant";
import useProducer from "../../media/hooks/useProducer";
import useProducerEmitters from "../../media/websocket/emitters/mediasoup/producer";

export default function useChannelManager() {
  const { emitGetRtpCapabilties, emitCreateTransport } = useTransportEmitters();
  const { emitCloseProducer } = useProducerEmitters();
  const { setDevice, sendTransport } = useMediasoupStore();
  const { setupSendTransport, setupRecvTransport } = useTransport();
  const { createVideoProducer, createDisplayProducer } = useProducer();
  const { removeProducer, removeStream, updateLocalParticipant } =
    useLocalParticipantStore();

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

  async function toogleCamera() {
    const { localParticipant } = useLocalParticipantStore.getState();

    const videoProducer = localParticipant?.producers.video;

    if (!videoProducer) {
      if (!sendTransport) throw new Error("Send transport missing");

      return await createVideoProducer(sendTransport);
    }

    try {
      await emitCloseProducer({
        producerId: videoProducer.id,
      });

      videoProducer.close();

      localParticipant.streams.video
        ?.getTracks()
        .forEach((track) => track.stop());

      removeProducer("video");
      removeStream("video");
      updateLocalParticipant({ camMuted: true });
    } catch (error) {
      console.error("Failed to close video producer");
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async function toogleScreenShare() {
    const { localParticipant } = useLocalParticipantStore.getState();

    const displayProducer = localParticipant?.producers.screen;

    if (!displayProducer) {
      if (!sendTransport) throw new Error("Send transport missing");

      return createDisplayProducer(sendTransport);
    }

    try {
      await emitCloseProducer({ producerId: displayProducer.id });

      displayProducer.close();

      localParticipant.streams.screen
        ?.getTracks()
        .forEach((track) => track.stop());

      removeProducer("screen");
      removeStream("screen");
      updateLocalParticipant({ isStreaming: false });
    } catch (error) {
      console.error("Failed to close display producer");
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  return { connectMediasoup, toogleCamera, toogleScreenShare };
}
