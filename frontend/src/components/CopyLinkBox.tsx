import { useState } from "react";
import { Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

export function CopyLinkBox({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTooltipOpen(true);

    setTimeout(() => {
      setTooltipOpen(false);
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="flex items-center w-full max-w-full rounded-md border border-white/10 bg-white/5 p-1">
      <input
        value={link}
        readOnly
        className="flex-1 cursor-text bg-transparent px-3 py-2 text-sm text-blue-100 outline-none w-full min-w-0 truncate"
      />
      <TooltipProvider>
        <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
          <TooltipTrigger asChild>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center rounded bg-white/5 p-2 text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="bg-[#0f1219] border border-white/10 text-white px-3 py-1.5 text-xs font-semibold"
          >
            {copied ? "Copied!" : "Copy link"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
