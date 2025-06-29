import { Server as ServerIO, Socket } from "socket.io";
import { env } from "../env";
import ChannelListeners from "./listeners/channels/channel";
import { getUserSessionById } from "redis/methods/session";
import TransportListeners from "./listeners/mediasoup/transport";

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
    new TransportListeners(io, socket).registerListeners();
  });
}

export { createSocketServer };
