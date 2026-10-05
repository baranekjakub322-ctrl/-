import { DayPicker } from "react-day-picker";
import { pl } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CLS = {
  months: "flex flex-col gap-8 md:flex-row md:gap-10",
  month: "w-full space-y-4",
  caption: "relative flex items-center justify-center pt-1",
  caption_label: "font-display text-lg font-bold capitalize text-white",
  nav: "flex items-center",
  nav_button: "grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10",
  nav_button_previous: "absolute left-0",
  nav_button_next: "absolute right-0",
  table: "w-full border-collapse",
  head_row: "flex",
  head_cell: "flex-1 text-center font-mono text-[11px] uppercase text-zinc-400",
  row: "mt-1.5 flex w-full",
  cell: "relative flex-1 p-0.5 text-center",
  day: "rdp-cell-day mx-auto grid aspect-square w-full max-w-[46px] place-items-center rounded-xl text-sm font-medium text-white transition-colors hover:bg-white/10",
  day_today: "ring-1 ring-zinc-400/70",
  day_outside: "opacity-30",
  day_disabled: "cursor-not-allowed text-zinc-500 hover:bg-transparent",
  day_selected: "!bg-white !text-[#0A0A0A] font-bold",
  day_range_middle: "!bg-white/25 !text-white !rounded-md",
  day_hidden: "invisible",
};

export const RentCalendar = ({ booked, months = 2, ...props }) => (
  <DayPicker
    locale={pl}
    weekStartsOn={1}
    numberOfMonths={months}
    showOutsideDays={false}
    classNames={CLS}
    modifiers={{ booked }}
    modifiersClassNames={{ booked: "day-booked" }}
    components={{ IconLeft: () => <ChevronLeft className="h-4 w-4" />, IconRight: () => <ChevronRight className="h-4 w-4" /> }}
    {...props}
  />
);
