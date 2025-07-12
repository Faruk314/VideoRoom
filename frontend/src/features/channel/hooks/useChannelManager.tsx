import { useCallback } from "react";
import useTransport from "../../media/hooks/useTransport";
import { useMediasoupStore } from "../../media/store/mediasoup";
import { useTransportEmitters } from "../../media/websocket/emitters/mediasoup/transport";
import { Device } from "mediasoup-client";
import { useLocalParticipantStore } from "../store/localParticipant";
import useProducer from "../../media/hooks/useProducer";
import useProducerEmitters from "../../media/websocket/emitters/mediasoup/producer";
import useConsumerEmitters from "../../media/websocket/emitters/mediasoup/consumer";
import useConsumer from "../../media/hooks/useConsumer";
import { useChannelStore } from "../store/channel";

export default function useChannelManager() {
  const { emitGetRtpCapabilties, emitCreateTransport } = useTransportEmitters();
  const { emitCloseProducer } = useProducerEmitters();
  const { setDevice, sendTransport } = useMediasoupStore();
  const { setupSendTransport, setupRecvTransport } = useTransport();
  const { createVideoProducer, createDisplayProducer } = useProducer();
  const { emitCreateConsumers } = useConsumerEmitters();
  const { setupConsumer } = useConsumer();
  const { removeProducer, removeStream, updateLocalParticipant } =
    useLocalParticipantStore();

  const connectMediasoup = useCallback(async (channelId: string) => {
    const localParticipant =
      useLocalParticipantStore.getState().localParticipant;

    try {
      const { routerRtpCapabilities } = await emitGetRtpCapabilties({
        channelId,
      });

      const device = new Device();

      await device.load({ routerRtpCapabilities });

      setDevice(device);

      const { sendTransport, recvTransport } = await emitCreateTransport();

      const clientSendTransport = await setupSendTransport(
        sendTransport,
        device
      );

      setupRecvTransport(recvTransport, device);

      if (!localParticipant?.camMuted)
        await createVideoProducer(clientSendTransport);

      const { data: consumersData } = await emitCreateConsumers({
        rtpCapabilities: device.rtpCapabilities,
      });

      await Promise.all(
        consumersData.map((consumer) => setupConsumer(consumer))
      );
    } catch (error) {
      console.error("Failed to connect with mediasoup server");

      if (error instanceof Error) throw new Error(error.message);
    }
  }, []);

  async function stopStream(kind: "video" | "screen") {
    try {
      const { localParticipant } = useLocalParticipantStore.getState();
      const { displayedAvatar, setDisplayedAvatar } =
        useChannelStore.getState();
      const producer = localParticipant?.producers[kind];
      const stream = localParticipant?.streams[kind];

      if (!producer) return;

      await emitCloseProducer({ producerId: producer.id });

      producer.close();
      stream?.getTracks().forEach((track) => track.stop());

      removeProducer(kind);
      removeStream(kind);

      if (kind === "video") {
        updateLocalParticipant({ camMuted: true });
      } else if (kind === "screen") {
        updateLocalParticipant({ isStreaming: false });
      }

      if (displayedAvatar?.stream === stream) {
        setDisplayedAvatar(null);
      }
    } catch (error) {
      console.error(`Failed to stop ${kind} stream`);
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async function toogleCamera() {
    const { localParticipant } = useLocalParticipantStore.getState();

    const videoProducer = localParticipant?.producers.video;

    if (!videoProducer) {
      if (!sendTransport) throw new Error("Send transport missing");

      return await createVideoProducer(sendTransport);
    }

    await stopStream("video");
  }

  async function toogleScreenShare() {
    const { localParticipant } = useLocalParticipantStore.getState();

    const displayProducer = localParticipant?.producers.screen;

    if (!displayProducer) {
      if (!sendTransport) throw new Error("Send transport missing");

      return createDisplayProducer(sendTransport);
    }

    await stopStream("screen");
  }

  return { connectMediasoup, toogleCamera, toogleScreenShare, stopStream };
}
