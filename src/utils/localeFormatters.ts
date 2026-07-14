import type { AppLocale } from "../types/settings";

/**
 * Formats a date based on the current locale
 */
export function formatDate(
  value: string | number | Date,
  locale: AppLocale,
): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch (e) {
    console.error("Error formatting date", e);
    return String(value);
  }
}

/**
 * Formats a number based on the current locale
 */
export function formatNumber(
  value: number,
  locale: AppLocale,
): string {
  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch (e) {
    console.error("Error formatting number", e);
    return String(value);
  }
}

/**
 * Formats a list of strings based on the current locale
 */
export function formatList(
  items: string[],
  locale: AppLocale,
): string {
  if (!items || items.length === 0) return "";
  try {
    return new Intl.ListFormat(locale, {
      style: "long",
      type: "conjunction",
    }).format(items);
  } catch (e) {
    console.error("Error formatting list", e);
    return items.join(", ");
  }
}
