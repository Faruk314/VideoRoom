import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday } from "date-fns";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatMessageTime(date: Date, short = false): string {
  if (short) {
    return format(date, "h:mm a");
  }

  if (isToday(date)) {
    return format(date, "h:mm a");
  }

  return format(date, "MMMM d 'at' h:mm a");
}

function truncateText(str: string, limit = 20) {
  if (!str) return "";

  if (str.length <= limit) {
    return str;
  }

  return str.slice(0, limit).trim() + "...";
}

export { cn, formatMessageTime, truncateText };
