export type YearMonth = {
  year: number;
  month: number;
};

/** First professional role: Yusata Infotech, August 2019. */
export const careerStart: YearMonth = { year: 2019, month: 8 };

/**
 * Inclusive calendar span. August 2019 through October 2026 is 7 yr 3 months,
 * and November 2026 is 7 yr 4 months.
 */
export function tenureParts(
  start: YearMonth,
  end: YearMonth | "present",
  now = new Date(),
) {
  const finish =
    end === "present"
      ? { year: now.getFullYear(), month: now.getMonth() + 1 }
      : end;
  const totalMonths =
    (finish.year - start.year) * 12 + (finish.month - start.month) + 1;
  const safe = Math.max(totalMonths, 1);
  return {
    years: Math.floor(safe / 12),
    months: safe % 12,
  };
}

export function formatTenure(
  start: YearMonth,
  end: YearMonth | "present" = "present",
  now = new Date(),
) {
  const { years, months } = tenureParts(start, end, now);
  const yearLabel = years === 1 ? "1 yr" : `${years} yr`;
  const monthLabel = months === 1 ? "1 month" : `${months} months`;

  if (years === 0) return monthLabel;
  if (months === 0) return yearLabel;
  return `${yearLabel} ${monthLabel}`;
}
