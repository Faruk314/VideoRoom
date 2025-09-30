import { types } from "mediasoup";
import { WebRtcServerOptions, WebRtcTransportOptions } from "mediasoup/types";
import { env } from "env";

const mediaCodecs: types.RtpCodecCapability[] = [
  {
    kind: "audio",
    mimeType: "audio/opus",
    clockRate: 48000,
    channels: 2,
    preferredPayloadType: 111,
  },
  {
    kind: "video",
    mimeType: "video/VP8",
    clockRate: 90000,
    parameters: { "x-google-start-bitrate": 1000 },
    preferredPayloadType: 96,
  },
];

const webRtcServerOptions: WebRtcServerOptions = {
  listenInfos: [
    {
      protocol: "udp",
      ip: env.MEDIASOUP_LISTEN_IP,
      announcedAddress: env.MEDIASOUP_ANNOUNCED_IP,
      port: env.MEDIASOUP_PORT,
      portRange: {
        min: env.MEDIASOUP_PORT_MIN,
        max: env.MEDIASOUP_PORT_MAX,
      },
    },
    {
      protocol: "tcp",
      ip: env.MEDIASOUP_LISTEN_IP,
      announcedAddress: env.MEDIASOUP_ANNOUNCED_IP,
      portRange: {
        min: env.MEDIASOUP_PORT_MIN,
        max: env.MEDIASOUP_PORT_MAX,
      },
    },
  ],
};

const webRtcTransportOptions: WebRtcTransportOptions = {
  listenInfos: [
    {
      protocol: "udp",
      ip: env.MEDIASOUP_LISTEN_IP,
      announcedAddress: env.MEDIASOUP_ANNOUNCED_IP,
      portRange: {
        min: env.MEDIASOUP_PORT_MIN,
        max: env.MEDIASOUP_PORT_MAX,
      },
    },
    {
      protocol: "tcp",
      ip: env.MEDIASOUP_LISTEN_IP,
      announcedAddress: env.MEDIASOUP_ANNOUNCED_IP,
      portRange: {
        min: env.MEDIASOUP_PORT_MIN,
        max: env.MEDIASOUP_PORT_MAX,
      },
    },
  ],
  initialAvailableOutgoingBitrate: env.MEDIASOUP_INITIAL_BITRATE,
  maxSctpMessageSize: env.MEDIASOUP_MAX_SCTP_MESSAGE_SIZE,
};

const plainTransportOptions = {
  listenInfo: {
    protocol: "udp",
    ip: env.MEDIASOUP_LISTEN_IP,
    announcedAddress: env.MEDIASOUP_ANNOUNCED_IP,
    portRange: {
      min: env.MEDIASOUP_PORT_MIN,
      max: env.MEDIASOUP_PORT_MAX,
    },
  },
  maxSctpMessageSize: env.MEDIASOUP_MAX_SCTP_MESSAGE_SIZE,
};

export {
  mediaCodecs,
  webRtcServerOptions,
  webRtcTransportOptions,
  plainTransportOptions,
};
