import { useMediasoupStore } from "../../media/store/mediasoup";
import { useLocalParticipantStore } from "../store/localParticipant";
import useProducer from "../../media/hooks/useProducer";
import useProducerEmitters from "../../media/websocket/emitters/mediasoup/producer";
import { useChannelStore } from "../store/channel";
import type { MediaKind } from "../../media/types/media";
import { useMedia } from "../../media/hooks/useMedia";
import { useMediaStore } from "../../media/store/media";

export default function useChannelManager() {
  const { emitCloseProducer } = useProducerEmitters();
  const { sendTransport } = useMediasoupStore();
  const { getDisplayStream, getAudioStream, getMediaStream } = useMedia();
  const { setSelectedMic, setSelectedCamera } = useMediaStore();
  const { removeProducer, removeStream, updateLocalParticipant, addStream } =
    useLocalParticipantStore();
  const { createVideoProducer, createAudioProducer, createDisplayProducer } =
    useProducer();

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

      newAudioTrack.onended = async () => {
        await stopStream("audio");
      };
    } catch (error) {
      console.error("Error switching audio producer stream", error);
    }
  }

  async function switchCamera(device: MediaDeviceInfo) {
    const { localParticipant } = useLocalParticipantStore.getState();

    setSelectedCamera(device);

    if (!localParticipant?.producers.video) return;

    const currentVideoProducer = localParticipant.producers.video;
    const currentVideoStream = localParticipant.streams.video;

    try {
      const { stream: newStream, videoTrack: newVideoTrack } =
        await getMediaStream(device.deviceId);

      await currentVideoProducer.replaceTrack({ track: newVideoTrack });

      const oldVideoTrack = currentVideoStream?.getVideoTracks()[0];
      oldVideoTrack?.stop();

      addStream("video", newStream);

      newVideoTrack.onended = async () => {
        await stopStream("video");
      };
    } catch (error) {
      console.error("Error switching video producer stream", error);
    }
  }

  return {
    toogleCamera,
    toogleScreenShare,
    toogleMicrophone,
    stopStream,
    switchScreenShare,
    switchMicrophone,
    switchCamera,
  };
}
