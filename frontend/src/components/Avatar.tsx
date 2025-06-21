import { cn } from "../lib/utils";

interface AvatarProps {
  imageSrc?: string | null;
  name?: string;
  className?: string;
}

export default function Avatar({ imageSrc, className, name }: AvatarProps) {
  return (
    <span
      className={cn(
        "relative w-14 h-14 rounded-full overflow-hidden",
        "text-white text-2xl font-black uppercase bg-indigo-600 shadow-md",
        "flex items-center justify-center",
        className
      )}
    >
      {imageSrc ? (
        <img src={imageSrc} alt={`images`} className="bg-white" />
      ) : (
        <span className="z-10">{name?.slice(0, 1)}</span>
      )}
    </span>
  );
}
