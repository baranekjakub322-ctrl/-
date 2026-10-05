import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Phone } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PHONE, copyText } from "@/lib/api";

export const CallGuard = () => {
  const [href, setHref] = useState(null);
  useEffect(() => {
    const on = (e) => {
      const a = e.target.closest?.('a[href^="tel:"]');
      if (!a) return;
      e.preventDefault();
      if (window.matchMedia("(pointer: coarse)").matches) setHref(a.getAttribute("href"));
      else copyText(PHONE).then(() => toast.success(`Numer ${PHONE} skopiowany — zadzwoń z telefonu`));
    };
    document.addEventListener("click", on, true);
    return () => document.removeEventListener("click", on, true);
  }, []);
  return (
    <AlertDialog open={!!href} onOpenChange={(o) => { if (!o) setHref(null); }}>
      <AlertDialogContent data-testid="call-confirm-dialog" className="max-w-[90vw] rounded-3xl border-white/10 bg-[#141414] text-white sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 font-display text-xl"><Phone className="h-5 w-5" />Czy chcesz zadzwonić?</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-300">Połączymy Cię z numerem {PHONE}.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-3 sm:justify-end">
          <AlertDialogCancel data-testid="call-confirm-no" className="mt-0 flex-1 rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white sm:flex-none">Nie</AlertDialogCancel>
          <AlertDialogAction data-testid="call-confirm-yes" onClick={() => { window.location.href = href; }} className="flex-1 rounded-full bg-white text-[#0A0A0A] hover:bg-zinc-200 sm:flex-none">Tak, zadzwoń</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
