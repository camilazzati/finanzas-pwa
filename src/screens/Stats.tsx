import type { Transaction, TransactionType, YearMonth } from "../types";
import { formatCurrency, formatMonthLabel } from "../lib/format";
import { isInMonth, summarize } from "../lib/transactions";
import { MonthSelector } from "../components/MonthSelector";
import { EmptyState } from "../components/EmptyState";

interface StatsProps {
  transactions: Transaction[];
  selectedMonth: YearMonth;
  onMonthChange: (value: YearMonth) => void;
}

interface CategorySlice {
  category: string;
  amount: number;
  share: number;
}

function buildSlices(
  transactions: Transaction[],
  type: TransactionType,
): { slices: CategorySlice[]; total: number } {
  const totals = new Map<string, number>();
  let total = 0;

  for (const transaction of transactions) {
    if (transaction.type !== type) continue;
    totals.set(
      transaction.category,
      (totals.get(transaction.category) ?? 0) + transaction.amount,
    );
    total += transaction.amount;
  }

  const slices = Array.from(totals.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      share: total > 0 ? amount / total : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return { slices, total };
}

interface CategoryBreakdownProps {
  title: string;
  type: TransactionType;
  slices: CategorySlice[];
  total: number;
  emptyLabel: string;
}

function CategoryBreakdown({
  title,
  type,
  slices,
  total,
  emptyLabel,
}: CategoryBreakdownProps) {
  return (
    <section className="stats-block">
      <div className="section-heading compact">
        <h3>{title}</h3>
        <span className={`stat-total ${type}`}>{formatCurrency(total)}</span>
      </div>

      {slices.length === 0 ? (
        <p className="stats-empty">{emptyLabel}</p>
      ) : (
        <ul className="category-list">
          {slices.map((slice) => (
            <li key={slice.category} className="category-row">
              <div className="category-row-top">
                <span className="category-name">{slice.category}</span>
                <span className="category-amount">
                  {formatCurrency(slice.amount)}
                  <em>{Math.round(slice.share * 100)}%</em>
                </span>
              </div>
              <div className="category-track">
                <div
                  className={`category-fill ${type}`}
                  style={{ width: `${Math.max(slice.share * 100, 2)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function Stats({
  transactions,
  selectedMonth,
  onMonthChange,
}: StatsProps) {
  const monthTransactions = transactions.filter((transaction) =>
    isInMonth(transaction, selectedMonth),
  );
  const summary = summarize(monthTransactions);
  const monthLabel = formatMonthLabel(selectedMonth);

  const expenses = buildSlices(monthTransactions, "expense");
  const incomes = buildSlices(monthTransactions, "income");
  const comparisonMax = Math.max(summary.income, summary.expenses, 1);

  return (
    <>
      <section className="screen-heading">
        <div>
          <p className="eyebrow">TUS NÚMEROS</p>
          <h2>Estadísticas</h2>
        </div>
      </section>

      <MonthSelector value={selectedMonth} onChange={onMonthChange} />

      {monthTransactions.length === 0 ? (
        <EmptyState
          icon="📊"
          title="Sin datos para graficar"
          description={`No hay movimientos en ${monthLabel.toLowerCase()}. Elegí otro mes para ver tus estadísticas.`}
        />
      ) : (
        <>
          <section className="stats-block">
            <div className="section-heading compact">
              <h3>Ingresos vs. gastos</h3>
              <span className="stat-balance">
                Balance {formatCurrency(summary.balance)}
              </span>
            </div>

            <div className="comparison">
              <div className="comparison-row">
                <span className="comparison-label">Ingresos</span>
                <div className="comparison-track">
                  <div
                    className="comparison-fill income"
                    style={{
                      width: `${(summary.income / comparisonMax) * 100}%`,
                    }}
                  />
                </div>
                <span className="comparison-value income">
                  {formatCurrency(summary.income)}
                </span>
              </div>

              <div className="comparison-row">
                <span className="comparison-label">Gastos</span>
                <div className="comparison-track">
                  <div
                    className="comparison-fill expense"
                    style={{
                      width: `${(summary.expenses / comparisonMax) * 100}%`,
                    }}
                  />
                </div>
                <span className="comparison-value expense">
                  {formatCurrency(summary.expenses)}
                </span>
              </div>
            </div>
          </section>

          <CategoryBreakdown
            title="Gastos por categoría"
            type="expense"
            slices={expenses.slices}
            total={expenses.total}
            emptyLabel="No registraste gastos en este mes."
          />

          <CategoryBreakdown
            title="Ingresos por categoría"
            type="income"
            slices={incomes.slices}
            total={incomes.total}
            emptyLabel="No registraste ingresos en este mes."
          />
        </>
      )}
    </>
  );
}
