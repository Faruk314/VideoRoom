import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  className?: string;
  wrapperClassName?: string;
  error?: string;
}

export function PrimaryInput({
  icon,
  className,
  wrapperClassName,
  error,
  ...props
}: Props) {
  return (
    <div className="relative">
      <div
        className={cn(
          "flex space-x-4 items-center border rounded-md px-4 py-2 md:py-3 focus-within:outline focus-within:outline-1",
          error
            ? "border-red-600 focus-within:outline-red-600"
            : "border-black focus-within:outline-indigo-500",
          wrapperClassName
        )}
      >
        {icon}
        <input className={cn("outline-none w-full")} {...props} />
      </div>
      {error && (
        <span className="absolute -bottom-5 left-2 text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
