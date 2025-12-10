import { useEffect, useRef } from "react";

export interface Props {
  audioStream?: MediaStream;
  isLocal?: boolean;
}

export default function ChannelAvatarAudio({ audioStream, isLocal }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current || !audioStream) return;
    audioRef.current.srcObject = audioStream;
    audioRef.current.play().catch(() => {});
  }, [audioStream]);

  return <audio ref={audioRef} playsInline muted={isLocal} />;
}
