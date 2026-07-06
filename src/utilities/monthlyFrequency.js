// Reusable helpers for the "Monthly Frequency" sub-scheme configuration.
//
// When a sub scheme has monthlyFrequency === true, the Service Application shows a
// single, financial-year-aware Month dropdown. Selecting a month auto-populates the
// Period From / Period To dates (first and last day of that month, leap-year safe).
//
// These helpers are generic and must NOT be hardcoded to any specific scheme.

// Uppercase month names, indexed 0 (Jan) .. 11 (Dec) — matches the value stored in
// sc_application_form_service.month (e.g. "APRIL 2026").
const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

// Title-case a single month name, e.g. "APRIL" -> "April".
const titleCaseMonth = (name) =>
  name ? name.charAt(0) + name.slice(1).toLowerCase() : name;

// Parse the starting calendar year from a financial-year string.
// Accepts "2026-2027", "2026-27", "2026 - 2027", 2026, etc. Returns a Number or null.
export const getFinancialYearStartYear = (financialYearStr) => {
  if (financialYearStr === null || financialYearStr === undefined) return null;
  const match = String(financialYearStr).match(/(\d{4})/);
  return match ? parseInt(match[1], 10) : null;
};

// Build the ordered month list for a financial year (April of startYear .. March of
// startYear + 1). Returns [{ value, label, monthIndex, year }] where:
//   value     -> stored form, e.g. "APRIL 2026"
//   label     -> display form, e.g. "April 2026"
//   monthIndex-> JS month index 0..11
//   year      -> calendar year the month falls in
// Returns [] when the financial year cannot be parsed.
export const getFinancialYearMonths = (financialYearStr) => {
  const startYear = getFinancialYearStartYear(financialYearStr);
  if (!startYear) return [];

  const months = [];
  // Financial year runs April (index 3) through the following March.
  for (let offset = 3; offset <= 14; offset += 1) {
    const monthIndex = offset % 12;
    const year = offset <= 11 ? startYear : startYear + 1;
    const name = MONTH_NAMES[monthIndex];
    months.push({
      value: `${name} ${year}`,
      label: `${titleCaseMonth(name)} ${year}`,
      monthIndex,
      year,
    });
  }
  return months;
};

// Parse a stored month value ("APRIL 2026") back into { monthIndex, year }.
// Returns null when the value is empty or not in the expected form.
export const parseMonthYear = (value) => {
  if (!value) return null;
  const parts = String(value).trim().split(/\s+/);
  if (parts.length < 2) return null;
  const monthIndex = MONTH_NAMES.indexOf(parts[0].toUpperCase());
  const year = parseInt(parts[1], 10);
  if (monthIndex < 0 || Number.isNaN(year)) return null;
  return { monthIndex, year };
};

// Compute the first and last day of a month. Using day 0 of the next month yields the
// correct last day for every month, including February in leap years (28 vs 29).
export const getMonthPeriod = (year, monthIndex) => ({
  periodFrom: new Date(year, monthIndex, 1),
  periodTo: new Date(year, monthIndex + 1, 0),
});

// Convenience: derive { periodFrom, periodTo } directly from a stored month value.
// Returns { periodFrom: null, periodTo: null } when the value cannot be parsed.
export const getMonthPeriodByValue = (value) => {
  const parsed = parseMonthYear(value);
  if (!parsed) return { periodFrom: null, periodTo: null };
  return getMonthPeriod(parsed.year, parsed.monthIndex);
};
