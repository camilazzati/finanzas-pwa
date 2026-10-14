import type { YearMonth } from "../types";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const shortDateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
});

const monthFormatter = new Intl.DateTimeFormat("es-AR", {
  month: "long",
  year: "numeric",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

export function formatSignedCurrency(
  value: number,
  type: "income" | "expense",
): string {
  return `${type === "income" ? "+" : "−"}${formatCurrency(Math.abs(value))}`;
}

/** Parsea "YYYY-MM-DD" como fecha local para evitar corrimientos por zona horaria. */
export function parseISODate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

/** Serializa una fecha local a "YYYY-MM-DD" sin pasar por UTC. */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatShortDate(value: string): string {
  return shortDateFormatter.format(parseISODate(value));
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatMonthLabel({ year, month }: YearMonth): string {
  return capitalize(monthFormatter.format(new Date(year, month, 1)));
}

export function addMonths({ year, month }: YearMonth, delta: number): YearMonth {
  const date = new Date(year, month + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}

export function isSameMonth(a: YearMonth, b: YearMonth): boolean {
  return a.year === b.year && a.month === b.month;
}

export function currentYearMonth(): YearMonth {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

/**
 * Convierte entradas argentinas como "1500", "1500,50" o "1.500,50"
 * a un número, devolviendo NaN cuando el texto no es un importe válido.
 */
export function parseAmount(input: string): number {
  const cleaned = input.trim().replace(/\$/g, "").replace(/\s/g, "");

  if (!cleaned || !/^[\d.,]+$/.test(cleaned)) {
    return Number.NaN;
  }

  const commaCount = (cleaned.match(/,/g) ?? []).length;
  if (commaCount > 1) {
    return Number.NaN;
  }

  const hasDot = cleaned.includes(".");
  const hasComma = cleaned.includes(",");

  if (hasDot && hasComma) {
    // "1.500,50": los puntos son miles y la coma es decimal.
    return Number(cleaned.replace(/\./g, "").replace(",", "."));
  }

  if (hasComma) {
    return Number(cleaned.replace(",", "."));
  }

  if (hasDot) {
    // "1.500" => miles; "1500.50" => decimal.
    if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) {
      return Number(cleaned.replace(/\./g, ""));
    }
    return Number(cleaned);
  }

  return Number(cleaned);
}
