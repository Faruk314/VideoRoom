import { useEffect, useRef } from "react";
import { useChannelHoverStore } from "../features/channel/store/channelHover";

export function useMouseHover(delay = 2000) {
  const setIsHovering = useChannelHoverStore((s) => s.setIsHovering);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = () => {
      useChannelHoverStore.getState().isHovering || setIsHovering(true);

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
