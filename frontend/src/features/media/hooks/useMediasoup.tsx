import { useCallback } from "react";
import { useLocalParticipantStore } from "../../channel/store/localParticipant";
import { useTransportEmitters } from "../websocket/emitters/mediasoup/transport";
import useConsumer from "./useConsumer";
import useTransport from "./useTransport";
import useConsumerEmitters from "../websocket/emitters/mediasoup/consumer";
import { Device } from "mediasoup-client";
import useProducer from "./useProducer";
import { useMediasoupStore } from "../store/mediasoup";
import useChannelManager from "../../channel/hooks/useChannelManager";

export default function useMediasoup() {
  const { emitGetRtpCapabilties, emitCreateTransport } = useTransportEmitters();
  const { setupSendTransport, setupRecvTransport } = useTransport();
  const { emitCreateConsumers } = useConsumerEmitters();
  const { setupConsumer } = useConsumer();
  const { createVideoProducer, createAudioProducer } = useProducer();
  const { setDevice } = useMediasoupStore();
  const { stopStream } = useChannelManager();

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

      if (!localParticipant?.camMuted) {
        const videoTrack = await createVideoProducer(clientSendTransport);

        if (videoTrack) {
          videoTrack.onended = async () => {
            await stopStream("video");
          };
        }
      }

      if (!localParticipant?.deafened && !localParticipant?.micMuted) {
        const audioTrack = await createAudioProducer(clientSendTransport);

        if (audioTrack) {
          audioTrack.onended = async () => {
            await stopStream("audio");
          };
        }
      }

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

  return { connectMediasoup };
}
