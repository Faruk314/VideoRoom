import type {
  DtlsParameters,
  IceCandidate,
  IceParameters,
} from "mediasoup-client/types";

interface ITransport {
  id: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
  iceServers: { urls: string }[];
}

export type { ITransport };
