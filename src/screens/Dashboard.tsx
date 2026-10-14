import type { Transaction, YearMonth } from "../types";
import { formatMonthLabel } from "../lib/format";
import { isInMonth, sortByDateDesc, summarize } from "../lib/transactions";
import { BalanceCard } from "../components/BalanceCard";
import { MonthSelector } from "../components/MonthSelector";
import { TransactionList } from "../components/TransactionList";

interface DashboardProps {
  transactions: Transaction[];
  selectedMonth: YearMonth;
  onMonthChange: (value: YearMonth) => void;
  onAdd: () => void;
  onSeeAll: () => void;
}

const RECENT_LIMIT = 5;

export function Dashboard({
  transactions,
  selectedMonth,
  onMonthChange,
  onAdd,
  onSeeAll,
}: DashboardProps) {
  const totalSummary = summarize(transactions);
  const monthTransactions = transactions.filter((transaction) =>
    isInMonth(transaction, selectedMonth),
  );
  const monthSummary = summarize(monthTransactions);
  const recent = sortByDateDesc(monthTransactions).slice(0, RECENT_LIMIT);
  const monthLabel = formatMonthLabel(selectedMonth);

  return (
    <>
      <BalanceCard
        balance={totalSummary.balance}
        income={monthSummary.income}
        expenses={monthSummary.expenses}
        monthLabel={monthLabel}
      />

      <section className="quick-actions">
        <button className="primary-button" type="button" onClick={onAdd}>
          <span className="button-plus" aria-hidden="true">
            +
          </span>
          Nuevo movimiento
        </button>
      </section>

      <MonthSelector value={selectedMonth} onChange={onMonthChange} />

      <section className="transactions-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">TU ACTIVIDAD</p>
            <h2>Movimientos recientes</h2>
          </div>

          {monthTransactions.length > RECENT_LIMIT && (
            <button type="button" className="link-button" onClick={onSeeAll}>
              Ver todos
            </button>
          )}
        </div>

        <TransactionList
          transactions={recent}
          emptyTitle="Sin movimientos este mes"
          emptyDescription={`No registraste ingresos ni gastos en ${monthLabel.toLowerCase()}.`}
          emptyAction={
            <button type="button" className="link-button" onClick={onAdd}>
              Registrar el primero
            </button>
          }
        />
      </section>
    </>
  );
}
