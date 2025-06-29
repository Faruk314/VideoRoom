import { useMediasoupStore } from "../../media/store/mediasoup";
import { useTransportEmitters } from "../../media/websocket/emitters/mediasoup/transport";
import { Device } from "mediasoup-client";

export default function useParticipant() {
  const { emitGetRtpCapabilties } = useTransportEmitters();
  const { setDevice } = useMediasoupStore();

  async function connectMediasoup(channelId: string) {
    try {
      const { routerRtpCapabilities } = await emitGetRtpCapabilties({
        channelId,
      });

      const device = new Device();

      await device.load({ routerRtpCapabilities });

      setDevice(device);

      console.log("success", device);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);

      throw new Error("Failed to handle RTP capabilities");
    }
  }

  return { connectMediasoup };
}
