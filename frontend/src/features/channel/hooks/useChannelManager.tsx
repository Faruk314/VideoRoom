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
import type { MediaKind } from "../../media/types/media";
import { useMedia } from "../../media/hooks/useMedia";
import { useMediaStore } from "../../media/store/media";

export default function useChannelManager() {
  const { emitGetRtpCapabilties, emitCreateTransport } = useTransportEmitters();
  const { emitCloseProducer } = useProducerEmitters();
  const { setDevice, sendTransport } = useMediasoupStore();
  const { setupSendTransport, setupRecvTransport } = useTransport();
  const { emitCreateConsumers } = useConsumerEmitters();
  const { setupConsumer } = useConsumer();
  const { getDisplayStream, getAudioStream } = useMedia();
  const { setSelectedMic } = useMediaStore();
  const { removeProducer, removeStream, updateLocalParticipant, addStream } =
    useLocalParticipantStore();
  const { createVideoProducer, createAudioProducer, createDisplayProducer } =
    useProducer();

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

      if (!localParticipant?.deafened && !localParticipant?.micMuted)
        await createAudioProducer(clientSendTransport);

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

  async function stopStream(kind: MediaKind) {
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
      } else if (kind === "audio") {
        updateLocalParticipant({ micMuted: true });
      }

      if (displayedAvatar?.stream === stream) {
        setDisplayedAvatar(null);
      }
    } catch (error) {
      console.error(`Failed to stop ${kind} stream`);
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async function toogleMicrophone() {
    const { localParticipant } = useLocalParticipantStore.getState();

    const audioProducer = localParticipant?.producers.audio;

    if (!audioProducer) {
      if (!sendTransport) throw new Error("Send transport missing");

      return await createAudioProducer(sendTransport);
    }

    await stopStream("audio");
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

      const screenTrack = await createDisplayProducer(sendTransport);

      if (!screenTrack) return;

      screenTrack.onended = async () => {
        await stopStream("screen");
      };

      return;
    }

    await stopStream("screen");
  }

  async function switchScreenShare() {
    const { localParticipant } = useLocalParticipantStore.getState();

    if (!localParticipant?.producers.screen) return;

    const currentScreenProducer = localParticipant.producers.screen;
    const currentScreenStream = localParticipant.streams.screen;

    try {
      const { stream: newStream, screenTrack: newScreenTrack } =
        await getDisplayStream();

      await currentScreenProducer.replaceTrack({ track: newScreenTrack });

      const oldVideoTrack = currentScreenStream?.getVideoTracks()[0];

      oldVideoTrack?.stop();

      addStream("screen", newStream);

      newScreenTrack.onended = async () => {
        await stopStream("screen");
      };
    } catch (error) {
      console.error("Error switching screen share source", error);
    }
  }

  async function switchMicrophone(device: MediaDeviceInfo) {
    const { localParticipant } = useLocalParticipantStore.getState();

    setSelectedMic(device);

    if (!localParticipant?.producers.audio) return;

    const currentAudioProducer = localParticipant.producers.audio;
    const currentAudioStream = localParticipant.streams.audio;

    try {
      const { stream: newStream, audioTrack: newAudioTrack } =
        await getAudioStream(device.deviceId);

      await currentAudioProducer.replaceTrack({ track: newAudioTrack });

      const oldAudioTrack = currentAudioStream?.getAudioTracks()[0];

      oldAudioTrack?.stop();

      addStream("audio", newStream);
    } catch (error) {
      console.error("Error switching audio producer stream", error);
    }
  }

  return {
    connectMediasoup,
    toogleCamera,
    toogleScreenShare,
    toogleMicrophone,
    stopStream,
    switchScreenShare,
    switchMicrophone,
  };
}
