import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { io as clientIO, type Socket } from "socket.io-client";
import { SocketContext } from "../context/socket";

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const SERVER_URL = "http://localhost:3000";
    const SOCKET_PATH = "/ws";

    const socketInstance = clientIO(SERVER_URL, {
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
