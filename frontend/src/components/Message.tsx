import Avatar from "./Avatar";
import { formatMessageTime } from "../lib/utils";

interface Props {
  senderName: string;
  message: string;
  createdAt: Date;
  imageSrc?: string | null;
  isSameSenderAsPrevious: boolean;
}

export function Message(props: Props) {
  const { senderName, message, isSameSenderAsPrevious, imageSrc, createdAt } =
    props;

  if (isSameSenderAsPrevious) {
    return (
      <div className="flex space-x-2 items-baseline px-4 hover:bg-white/5 rounded transition-colors group">
        <span className="text-[0.6rem] w-10 shrink-0 text-blue-200/30 group-hover:opacity-100 opacity-0 transition-opacity">
            {formatMessageTime(new Date(createdAt))}
        </span>

        <p className="break-all whitespace-pre-line text-blue-100/90 text-sm md:text-base">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex space-x-3 items-start px-4 py-2 hover:bg-white/5 rounded transition-colors mt-2">
      <div className="shrink-0 mt-0.5">
        <Avatar name={senderName} imageSrc={imageSrc} className="w-9 h-9 border border-white/10" />
      </div>
      <div>
        <div className="flex items-baseline space-x-2">
          <span className="font-semibold text-sm text-blue-200">{senderName}</span>
          <span className="text-[0.7rem] text-blue-200/40">
            {formatMessageTime(new Date(createdAt))}
          </span>
        </div>
        <p className="break-all whitespace-pre-line text-blue-100/90 text-sm md:text-base mt-0.5">{message}</p>
      </div>
    </div>
  );
}
