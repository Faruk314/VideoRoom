import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { io as clientIO, type Socket } from "socket.io-client";
import { SocketContext } from "../context/socket";
import { useUserStore } from "../features/user/store/user";
import { useLocalParticipantStore } from "../features/channel/store/localParticipant";

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isLogged } = useUserStore();
  const { updateLocalParticipant } = useLocalParticipantStore();

  useEffect(() => {
    if (isLogged && socket) return;

    if (!isLogged) return;

    const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;
    const SOCKET_PATH = "/ws";

    const socketInstance = clientIO(WS_URL, {
      path: SOCKET_PATH,
      withCredentials: true,
    });

    socketInstance.on("connect", () => setIsConnected(true));
    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      updateLocalParticipant({ connected: false, isStreaming: false });
    });

    socketInstance.on("connect_error", (err) =>
      console.error("Connection Error:", err.message)
    );

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [isLogged]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
