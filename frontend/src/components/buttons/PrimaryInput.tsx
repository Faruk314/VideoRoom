import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  className?: string;
  wrapperClassName?: string;
}

export function PrimaryInput({
  icon,
  className,
  wrapperClassName,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "flex space-x-4 items-center border border-black rounded-md px-4 focus-within:outline focus-within:outline-2 focus-within:outline-indigo-500",
        wrapperClassName
      )}
    >
      {icon}
      <input className={cn("outline-none w-full py-2", className)} {...props} />
    </div>
  );
}
