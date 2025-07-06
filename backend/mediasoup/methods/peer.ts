import { IPeer } from "types/types";
import { producers } from "./producer";

const peers: Map<string, IPeer> = new Map();

function createPeer(peerData: IPeer) {
  const newPeer: IPeer = {
    ...peerData,
    recvTransport: undefined,
    sendTransport: undefined,
    producers: new Map(),
    consumers: new Map(),
  };

  peers.set(peerData.userId, newPeer);
}

function getPeer(peerId: string) {
  return peers.get(peerId);
}

function deletePeer(peerId: string) {
  peers.delete(peerId);
}

function cleanupPeerResources(peerId: string) {
  const peer = getPeer(peerId);

  if (!peer) return;

  peer.producers?.forEach((producer) => {
    producer.close();

    producers.delete(producer.id);
  });

  peer.producers?.clear();

  peer.consumers?.forEach((consumer) => consumer.close());

  peer.consumers?.clear();

  peer.sendTransport?.close();

  peer.recvTransport?.close();

  deletePeer(peerId);
}

export { createPeer, getPeer, deletePeer, cleanupPeerResources };
