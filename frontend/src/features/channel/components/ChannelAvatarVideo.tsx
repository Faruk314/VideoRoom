import { useEffect, useRef } from "react";
import Avatar from "../../../components/Avatar";
import classNames from "classnames";

export interface Props {
  userName: string;
  videoStream?: MediaStream;
  isDisplayed?: boolean;
}

export default function ChannelAvatarVideo({
  userName,
  videoStream,
  isDisplayed,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current || !videoStream) return;

    videoRef.current.srcObject = videoStream;
    videoRef.current.play().catch((error) => {
      console.error("Video failed to play", error);
    });
  }, [videoStream]);

  if (!videoStream) {
    return (
      <Avatar
        className={classNames("text-2xl", {
          "text-7xl h-30 w-30": isDisplayed,
        })}
        name={userName}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      playsInline
      muted={true}
      autoPlay
      className="object-cover"
    />
  );
}
