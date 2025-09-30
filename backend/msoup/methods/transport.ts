import { Router } from "mediasoup/types";
import { webRtcTransportOptions } from "msoup/config";
import { IPeer } from "types/types";

async function createWebRtcTransport(
  router: Router,
  peer: IPeer,
  type: "send" | "recv"
) {
  const transport = await router.createWebRtcTransport({
    ...webRtcTransportOptions,
    iceConsentTimeout: 20,
  });

  if (type === "send") {
    peer.sendTransport = transport;
  } else {
    peer.recvTransport = transport;
  }

  return {
    id: transport.id,
    iceParameters: transport.iceParameters,
    iceCandidates: transport.iceCandidates,
    dtlsParameters: transport.dtlsParameters,
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };
}

export { createWebRtcTransport };
