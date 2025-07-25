import { Router } from "mediasoup/types";
import { IPeer } from "types/types";

async function createWebRtcTransport(
  router: Router,
  peer: IPeer,
  type: "send" | "recv"
) {
  const transport = await router.createWebRtcTransport({
    listenIps: [{ ip: "127.0.0.1", announcedIp: undefined }],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
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
