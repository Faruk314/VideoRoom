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
          "flex space-x-4 items-center bg-white/5 border border-white/10 rounded-2xl px-4 md:px-5 py-3 md:py-4 transition-all duration-200 focus-within:bg-white/10 focus-within:border-blue-500/50 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.15)]",
          error ? "border-red-500/50 bg-red-500/5" : "",
          wrapperClassName
        )}
      >
        {icon}
        <input
          className={cn(
            "outline-none w-full bg-transparent text-white placeholder:text-white/30 font-medium text-[16px] tracking-wide",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <span className="absolute -bottom-6 left-1 text-sm text-red-400 font-medium tracking-wide flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"></span>
          {error}
        </span>
      )}
    </div>
  );
}
