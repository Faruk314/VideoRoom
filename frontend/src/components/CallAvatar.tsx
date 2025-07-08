import { useEffect, useRef } from "react";
import Avatar from "./Avatar";
import type { IParticipant } from "../features/channel/types/channel";
import type { Consumer } from "mediasoup-client/types";

interface Props {
  participant: Omit<IParticipant, "consumers">;
  consumer?: Consumer | null;
  stream?: MediaStream | null;
  isDisplayStream?: boolean;
}

export default function CallAvatar({
  participant,
  consumer,
  stream,
  isDisplayStream,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (stream) {
      video.srcObject = stream;
      video.play().catch(() => {});
    } else if (consumer?.track) {
      const consumerStream = new MediaStream([consumer.track]);
      video.srcObject = consumerStream;
      video.play().catch(() => {});
    } else {
      video.srcObject = null;
    }

    return () => {
      if (video) video.srcObject = null;
    };
  }, [consumer, stream]);

  const hasVideo = !!stream || !!consumer?.track;

  return (
    <div className="relative border border-gray-300 w-55 h-30 rounded-md flex items-center justify-center overflow-hidden cursor-pointer">
      {hasVideo ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted={participant.camMuted}
          playsInline
          autoPlay
        />
      ) : (
        <Avatar name={participant.user.userName} />
      )}

      {isDisplayStream && (
        <div className="absolute top-1 right-1 text-white bg-red-500 opacity-70 font-black rounded-full text-[0.9rem] px-2">
          Live
        </div>
      )}

      <div className="absolute bottom-1 left-1 text-white bg-black opacity-70 font-black rounded-full text-[0.9rem] px-2">
        {participant.user.userName}
      </div>
    </div>
  );
}
