import { Server as ServerIO, Socket } from "socket.io";
import { env } from "../env";
import ChannelListeners from "./listeners/channels/channel";
import { getUserSessionById } from "redis/methods/session";
import TransportListeners from "./listeners/mediasoup/transport";
import ProducerListeners from "./listeners/mediasoup/producer";
import ConsumerListeners from "./listeners/mediasoup/consumer";
import { cleanupPeerResources } from "msoup/methods/peer";
import { updateParticipant } from "redis/methods/participant";
import ParticipantListeners from "./listeners/channels/participant";

function createSocketServer(httpServer: import("http").Server) {
  const io = new ServerIO(httpServer, {
    path: "/ws",
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use(async (socket: Socket, next) => {
    const cookieHeader = socket.request.headers.cookie;

    if (!cookieHeader) return next(new Error("Missing cookie header"));

    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => c.split("="))
    );

    const sessionId = cookies.sessionId;

    if (!sessionId) return next(new Error("Missing session cookie"));

    const session = await getUserSessionById(sessionId);

    if (!session) {
      return next(new Error("Invalid session"));
    }

    socket.userId = session.userId;
    socket.userName = session.userName;

    next();
  });

  io.on("connection", (socket: Socket) => {
    console.log(`user connected with id ${socket.userId}`);

    new ChannelListeners(io, socket).registerListeners();
    new ParticipantListeners(io, socket).registerListeners();
    new TransportListeners(io, socket).registerListeners();
    new ProducerListeners(io, socket).registerListeners();
    new ConsumerListeners(io, socket).registerListeners();

    socket.on("disconnect", async () => {
      cleanupPeerResources(socket.userId);

      await updateParticipant(socket.userId, {
        connected: false,
        isStreaming: false,
      });
    });
  });
}

export { createSocketServer };
