import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  description?: string;
}

export function IconBtn({
  icon,
  description,
  className,
  ...props
}: IconButtonProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="relative">
      <button
        onMouseOver={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cn(
          "flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-sm h-11 w-11 md:h-12 md:w-12 cursor-pointer duration-200",
          className
        )}
        {...props}
      >
        {icon}
      </button>

      {isHovering && description && (
        <span className="absolute font-black bottom-full left-1/2 mb-2 -translate-x-1/2 bg-black/60 text-white rounded px-2 py-1 whitespace-nowrap">
          {description}
        </span>
      )}
    </div>
  );
}
