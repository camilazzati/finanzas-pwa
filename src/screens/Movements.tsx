import { useState } from "react";
import type { Transaction, TypeFilter, YearMonth } from "../types";
import { formatCurrency, formatMonthLabel } from "../lib/format";
import { isInMonth, sortByDateDesc, summarize } from "../lib/transactions";
import { MonthSelector } from "../components/MonthSelector";
import { FilterBar } from "../components/FilterBar";
import { TransactionList } from "../components/TransactionList";

interface MovementsProps {
  transactions: Transaction[];
  selectedMonth: YearMonth;
  onMonthChange: (value: YearMonth) => void;
  onAdd: () => void;
}

export function Movements({
  transactions,
  selectedMonth,
  onMonthChange,
  onAdd,
}: MovementsProps) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const monthTransactions = transactions.filter((transaction) =>
    isInMonth(transaction, selectedMonth),
  );
  const monthSummary = summarize(monthTransactions);
  const monthLabel = formatMonthLabel(selectedMonth);

  const categories = Array.from(
    new Set(transactions.map((transaction) => transaction.category)),
  ).sort((a, b) => a.localeCompare(b, "es"));

  const filtered = sortByDateDesc(
    monthTransactions.filter((transaction) => {
      const matchesType =
        typeFilter === "all" || transaction.type === typeFilter;
      const matchesCategory =
        categoryFilter === "all" || transaction.category === categoryFilter;
      return matchesType && matchesCategory;
    }),
  );

  const hasTransactions = monthTransactions.length > 0;

  return (
    <>
      <section className="screen-heading">
        <div>
          <p className="eyebrow">TUS REGISTROS</p>
          <h2>Movimientos</h2>
        </div>
        <button type="button" className="link-button" onClick={onAdd}>
          + Agregar
        </button>
      </section>

      <MonthSelector value={selectedMonth} onChange={onMonthChange} />

      <div className="month-summary" aria-label={`Resumen de ${monthLabel}`}>
        <div>
          <span className="summary-label">
            <span className="summary-dot income-dot" />
            Ingresos
          </span>
          <strong className="income">{formatCurrency(monthSummary.income)}</strong>
        </div>
        <div>
          <span className="summary-label">
            <span className="summary-dot expense-dot" />
            Gastos
          </span>
          <strong className="expense">
            {formatCurrency(monthSummary.expenses)}
          </strong>
        </div>
        <div>
          <span className="summary-label">Balance</span>
          <strong>{formatCurrency(monthSummary.balance)}</strong>
        </div>
      </div>

      {hasTransactions && (
        <FilterBar
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          categories={categories}
        />
      )}

      <p className="result-count">
        {hasTransactions
          ? `${filtered.length} ${
              filtered.length === 1 ? "movimiento" : "movimientos"
            } · ${monthLabel}`
          : ""}
      </p>

      {hasTransactions ? (
        <TransactionList
          transactions={filtered}
          emptyTitle="Sin resultados"
          emptyDescription="Ningún movimiento coincide con los filtros elegidos."
        />
      ) : (
        <TransactionList
          transactions={[]}
          emptyTitle="Sin movimientos este mes"
          emptyDescription={`No hay registros en ${monthLabel.toLowerCase()}. Probá con otro mes o agregá un movimiento.`}
          emptyAction={
            <button type="button" className="link-button" onClick={onAdd}>
              Registrar un movimiento
            </button>
          }
        />
      )}
    </>
  );
}
