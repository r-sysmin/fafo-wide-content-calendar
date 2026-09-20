import { useState, useCallback, useMemo } from "react";

export type CalendarView = "week" | "month" | "list";

function getWeekRange(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
}

function getMonthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

function formatWeekLabel(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startStr = start.toLocaleDateString("en-US", opts);
  const endStr = end.toLocaleDateString("en-US", { ...opts, year: "numeric" });
  return `${startStr}–${endStr}`;
}

function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function useCalendarState(initialDate?: Date) {
  const [anchorDate, setAnchorDate] = useState(initialDate ?? new Date());
  const [view, setView] = useState<CalendarView>("week");

  const weekRange = useMemo(() => getWeekRange(anchorDate), [anchorDate]);
  const monthRange = useMemo(() => getMonthRange(anchorDate), [anchorDate]);

  const range = useMemo(() => {
    const r = view === "month" ? monthRange : weekRange;
    return {
      rangeStart: r.start.toISOString(),
      rangeEnd: r.end.toISOString(),
    };
  }, [view, weekRange, monthRange]);

  const label = useMemo(() => {
    if (view === "month") return formatMonthLabel(anchorDate);
    return formatWeekLabel(weekRange.start, weekRange.end);
  }, [view, anchorDate, weekRange]);

  const navigateBack = useCallback(() => {
    setAnchorDate((prev) => {
      const d = new Date(prev);
      if (view === "month") {
        d.setMonth(d.getMonth() - 1);
      } else {
        d.setDate(d.getDate() - 7);
      }
      return d;
    });
  }, [view]);

  const navigateForward = useCallback(() => {
    setAnchorDate((prev) => {
      const d = new Date(prev);
      if (view === "month") {
        d.setMonth(d.getMonth() + 1);
      } else {
        d.setDate(d.getDate() + 7);
      }
      return d;
    });
  }, [view]);

  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekRange.start);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [weekRange]);

  const monthDays = useMemo(() => {
    const firstDay = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const gridStart = new Date(firstDay);
    gridStart.setDate(gridStart.getDate() - startOffset);

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [anchorDate]);

  return {
    view,
    setView,
    anchorDate,
    label,
    range,
    navigateBack,
    navigateForward,
    weekDays,
    monthDays,
    weekRange,
    monthRange,
  };
}
