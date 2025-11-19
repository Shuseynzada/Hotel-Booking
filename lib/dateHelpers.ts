export function addDays(base: string, offset: number): string {
  const date = new Date(base);
  date.setDate(date.getDate() + offset);
  return date.toISOString();
}

export function formatDateLabel(dateIso: string): string {
  const d = new Date(dateIso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function isTodayOrFuture(dateStr: string): boolean {
  if (!dateStr) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const picked = new Date(dateStr);
  picked.setHours(0, 0, 0, 0);

  return picked >= today;
}