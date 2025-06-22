import { IPeer } from "types/types";

const peers: Map<string, IPeer> = new Map();

function createPeer(peerData: IPeer) {
  const newPeer: IPeer = {
    ...peerData,
    recvTransport: undefined,
    sendTransport: undefined,
    producers: new Map(),
    consumers: new Map(),
  };

  peers.set(peerData.peerId, newPeer);
}

function getPeer(peerId: string) {
  return peers.get(peerId);
}

function deletePeer(peerId: string) {
  peers.delete(peerId);
}

function cleanupPeerResources(peerId: string) {
  const peer = getPeer(peerId);

  if (!peer) {
    throw new Error("Cleanup skipped peer does not exist");
  }

  peer.producers?.forEach((producer) => producer.close());

  peer.producers?.clear();

  peer.consumers?.forEach((consumer) => consumer.close());

  peer.consumers?.clear();

  peer.sendTransport?.close();

  peer.recvTransport?.close();

  deletePeer(peerId);
}

export { createPeer, getPeer, deletePeer, cleanupPeerResources };
