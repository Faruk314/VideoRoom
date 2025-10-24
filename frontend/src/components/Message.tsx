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
      <div className="flex space-x-2 items-baseline px-4 hover:bg-white rounded">
        <span className="text-[0.6rem] w-10 shrink-0"></span>

        <p className="break-all whitespace-pre-line">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex space-x-2 items-center px-4 py-1 hover:bg-white rounded">
      <div className="shrink-0">
        <Avatar name={senderName} imageSrc={imageSrc} className="w-10 h-10" />
      </div>
      <div>
        <div className="flex items-baseline space-x-2">
          <span className="font-semibold">{senderName}</span>
          <span className="text-[0.8rem]">
            {formatMessageTime(new Date(createdAt))}
          </span>
        </div>
        <p className="break-all whitespace-pre-line">{message}</p>
      </div>
    </div>
  );
}
