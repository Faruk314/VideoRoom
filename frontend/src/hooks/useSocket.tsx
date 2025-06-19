import { useContext } from "react";
import { SocketContext } from "../context/socket";

export function useSocket() {
  return useContext(SocketContext);
}
