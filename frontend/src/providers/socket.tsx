import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { io as clientIO, type Socket } from "socket.io-client";
import { SocketContext } from "../context/socket";

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;
    const SOCKET_PATH = "/ws";

    const socketInstance = clientIO(WS_URL, {
      path: SOCKET_PATH,
      withCredentials: true,
    });

    socketInstance.on("connect", () => setIsConnected(true));
    socketInstance.on("disconnect", () => setIsConnected(false));

    socketInstance.on("connect_error", (err) =>
      console.error("Connection Error:", err.message)
    );

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
