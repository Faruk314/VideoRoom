import { Server, Socket } from "socket.io";

class ParticipantListeners {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerListeners() {
    // this.socket.on("participantMute", this.onParticipantMute.bind(this));
  }
}

export default ParticipantListeners;
