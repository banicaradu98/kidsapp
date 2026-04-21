const MONTHS_RO = [
  "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
  "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie",
];

export interface EventDateDisplay {
  /** Main date string — always present */
  primary: string;
  /**
   * Secondary time string — only set for multi-day events that have a start_time.
   * For single-day events, the time is already embedded in `primary`.
   */
  secondary: string | null;
}

/**
 * Formats a listing's event date for display.
 *
 * Single-day:  "16 Iunie 2025, ora 10:00"  (time embedded)
 * Multi-day same month:  "16 - 18 Iunie 2025"  + secondary "Ora început: 10:00"
 * Multi-day diff months: "16 Iunie - 18 Iulie 2025" + secondary "Ora început: 10:00"
 *
 * All dates are read as UTC to avoid off-by-one day issues (timestamptz stored as midnight UTC).
 */
export function formatEventDate(
  event_date: string | null | undefined,
  event_end_date: string | null | undefined,
  start_time: string | null | undefined,
): EventDateDisplay | null {
  if (!event_date) return null;

  const start = new Date(event_date);
  if (isNaN(start.getTime())) return null;

  const startDay   = start.getUTCDate();
  const startMonth = MONTHS_RO[start.getUTCMonth()];
  const startYear  = start.getUTCFullYear();
  const time = start_time ? start_time.slice(0, 5) : null;

  // Normalise to YYYY-MM-DD for comparison
  const startKey = `${startYear}-${String(start.getUTCMonth() + 1).padStart(2, "0")}-${String(startDay).padStart(2, "0")}`;

  if (event_end_date) {
    const end = new Date(event_end_date);
    if (!isNaN(end.getTime())) {
      const endDay   = end.getUTCDate();
      const endMonth = MONTHS_RO[end.getUTCMonth()];
      const endYear  = end.getUTCFullYear();
      const endKey   = `${endYear}-${String(end.getUTCMonth() + 1).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`;

      // Multi-day only when dates differ
      if (endKey !== startKey) {
        let primary: string;
        if (start.getUTCMonth() === end.getUTCMonth() && startYear === endYear) {
          // Same month: "16 - 18 Iunie 2025"
          primary = `${startDay} - ${endDay} ${startMonth} ${startYear}`;
        } else if (startYear === endYear) {
          // Different months, same year: "16 Iunie - 18 Iulie 2025"
          primary = `${startDay} ${startMonth} - ${endDay} ${endMonth} ${endYear}`;
        } else {
          // Different years
          primary = `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
        }
        return {
          primary,
          secondary: time ? `Ora început: ${time}` : null,
        };
      }
    }
  }

  // Single day
  const datePart = `${startDay} ${startMonth} ${startYear}`;
  return {
    primary: time ? `${datePart}, ora ${time}` : datePart,
    secondary: null,
  };
}
