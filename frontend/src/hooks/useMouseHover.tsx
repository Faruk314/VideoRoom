import { useEffect } from "react";
import { useChannelStore } from "../features/channel/store/channel";

export function useMouseHover(delay = 2000) {
  const { isHovering, setIsHovering } = useChannelStore();

  useEffect(() => {
    let timeoutId: any;

    const handleMouseMove = () => {
      if (!isHovering) setIsHovering(true);

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsHovering(false);
      }, delay);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [isHovering, setIsHovering, delay]);
}
