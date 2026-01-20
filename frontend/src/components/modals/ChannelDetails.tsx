import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { IconBtn } from "../buttons/IconBtn";
import { AlertCircle } from "lucide-react";
import { CopyLinkBox } from "../CopyLinkBox";
import { useParams } from "react-router-dom";

export default function ChannelDetails() {
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const link = `${import.meta.env.VITE_FRONTEND_URL}/channel/${id}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconBtn
          description="Channel details"
          icon={<AlertCircle size={20} />}
          className="bg-[#0f1219]/80 backdrop-blur-xl border border-white/10 text-blue-200/70 hover:text-white hover:bg-white/5 shadow-lg"
        />
      </DialogTrigger>

      <DialogContent className="bg-[#0f1219]/95 backdrop-blur-2xl border border-white/10 text-white">
        <DialogTitle className="text-xl font-bold tracking-tight">Channel details</DialogTitle>

        <p className="text-sm text-blue-200/60">
          Share this channel link with the people you want to invite
        </p>

        <div className="pt-2">
            <CopyLinkBox link={link} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
