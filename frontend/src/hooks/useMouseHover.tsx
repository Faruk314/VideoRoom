import { useEffect, useRef } from "react";
import { useChannelStore } from "../features/channel/store/channel";

export function useMouseHover(delay = 2000) {
  const setIsHovering = useChannelStore((s) => s.setIsHovering);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = () => {
      useChannelStore.getState().isHovering || setIsHovering(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = window.setTimeout(() => {
        setIsHovering(false);
      }, delay);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [delay, setIsHovering]);
}
