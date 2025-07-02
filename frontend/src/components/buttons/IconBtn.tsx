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
          "flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-full h-12 w-12 md:h-13 md:w-13 cursor-pointer duration-200",
          className
        )}
        {...props}
      >
        {icon}
      </button>

      {isHovering && description && (
        <div className="absolute opacity-[0.7] bottom-full left-1/2 mb-2 -translate-x-1/2 bg-black text-white rounded px-2 py-1 whitespace-nowrap">
          {description}
        </div>
      )}
    </div>
  );
}
