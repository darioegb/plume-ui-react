// The date is a calendar day, so it is formatted in UTC to avoid shifting it with the time zone.
export function formatDue(iso: string, language: string): string {
  return new Intl.DateTimeFormat(language, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export function formatNumber(value: number, language: string): string {
  return new Intl.NumberFormat(language).format(value);
}

export function formatChange(
  value: number,
  language: string,
  percent = false,
): string {
  return new Intl.NumberFormat(language, {
    signDisplay: "exceptZero",
    style: percent ? "percent" : "decimal",
  }).format(value);
}

export function formatAgo(
  amount: number,
  unit: "day" | "week",
  language: string,
): string {
  return new Intl.RelativeTimeFormat(language, { numeric: "auto" }).format(
    -amount,
    unit,
  );
}

export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
