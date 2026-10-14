export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  title: string;
  category: string;
  /** Fecha en formato ISO (YYYY-MM-DD), usada como fuente de verdad. */
  date: string;
  amount: number;
  type: TransactionType;
  icon: string;
}

export type ThemeMode = "light" | "dark" | "system";

export type ResolvedTheme = "light" | "dark";

export type SectionId = "inicio" | "movimientos" | "estadisticas" | "ajustes";

export type TypeFilter = "all" | TransactionType;

export interface YearMonth {
  year: number;
  /** Mes con base 0 (0 = enero). */
  month: number;
}

export interface TransactionDraft {
  title: string;
  category: string;
  amount: number;
  type: TransactionType;
}
