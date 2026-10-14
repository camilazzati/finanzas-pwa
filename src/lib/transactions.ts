import type { Transaction, YearMonth } from "../types";
import { parseISODate, toISODate } from "./format";

export const CATEGORIES = [
  "Alimentación",
  "Transporte",
  "Vivienda",
  "Servicios",
  "Salud",
  "Ocio",
  "Educación",
  "Trabajo",
  "Otros",
] as const;

export const DEFAULT_CATEGORY = "Alimentación";

export const CATEGORY_ICONS: Record<string, string> = {
  Alimentación: "🛒",
  Transporte: "🚗",
  Vivienda: "🏠",
  Servicios: "💡",
  Salud: "💊",
  Ocio: "🎮",
  Educación: "📚",
  Trabajo: "💼",
  Otros: "📌",
};

export function categoryIcon(category: string): string {
  return CATEGORY_ICONS[category] ?? "📌";
}

export function isInMonth(transaction: Transaction, target: YearMonth): boolean {
  const date = parseISODate(transaction.date);
  return (
    date.getFullYear() === target.year && date.getMonth() === target.month
  );
}

export function sortByDateDesc(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort(
    (a, b) => parseISODate(b.date).getTime() - parseISODate(a.date).getTime(),
  );
}

export interface MonthSummary {
  income: number;
  expenses: number;
  balance: number;
}

export function summarize(transactions: Transaction[]): MonthSummary {
  let income = 0;
  let expenses = 0;

  for (const transaction of transactions) {
    if (transaction.type === "income") {
      income += transaction.amount;
    } else {
      expenses += transaction.amount;
    }
  }

  return { income, expenses, balance: income - expenses };
}

function isoDaysAgo(daysAgo: number): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return toISODate(date);
}

/**
 * Datos de ejemplo generados en relación al mes actual para poder probar la
 * navegación por meses. No representan finanzas reales del usuario.
 */
export function createSampleTransactions(): Transaction[] {
  const now = new Date();
  const sample: Omit<Transaction, "id" | "icon">[] = [
    { title: "Sueldo", category: "Trabajo", date: isoDaysAgo(20), amount: 950000, type: "income" },
    { title: "Supermercado", category: "Alimentación", date: isoDaysAgo(18), amount: 42500.5, type: "expense" },
    { title: "Alquiler", category: "Vivienda", date: isoDaysAgo(15), amount: 280000, type: "expense" },
    { title: "Freelance", category: "Trabajo", date: isoDaysAgo(12), amount: 180000, type: "income" },
    { title: "Nafta", category: "Transporte", date: isoDaysAgo(10), amount: 38500, type: "expense" },
    { title: "Farmacia", category: "Salud", date: isoDaysAgo(8), amount: 12750, type: "expense" },
    { title: "Cena con amigos", category: "Ocio", date: isoDaysAgo(5), amount: 26400, type: "expense" },
    { title: "Internet", category: "Servicios", date: isoDaysAgo(3), amount: 18500, type: "expense" },
    { title: "Café y medialunas", category: "Alimentación", date: isoDaysAgo(1), amount: 6800, type: "expense" },
  ];

  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 12);
  sample.push(
    { title: "Sueldo", category: "Trabajo", date: toISODate(new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 5)), amount: 900000, type: "income" },
    { title: "Supermercado", category: "Alimentación", date: toISODate(new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 12)), amount: 39800, type: "expense" },
    { title: "Alquiler", category: "Vivienda", date: toISODate(new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 15)), amount: 260000, type: "expense" },
  );

  return sortByDateDesc(
    sample.map((item, index) => ({
      ...item,
      id: `sample-${index}`,
      icon: categoryIcon(item.category),
    })),
  );
}

export function createTransactionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
