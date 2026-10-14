import { formatCurrency } from "../lib/format";

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
  monthLabel: string;
  caption?: string;
}

export function BalanceCard({
  balance,
  income,
  expenses,
  monthLabel,
  caption = "Resultado de tus movimientos de ejemplo",
}: BalanceCardProps) {
  return (
    <section className="balance-card">
      <div className="balance-top">
        <span>Balance total</span>
        <span className="balance-badge">ARS · $</span>
      </div>

      <p className="balance-amount">{formatCurrency(balance)}</p>

      <p className="balance-caption">{caption}</p>

      <div className="balance-divider" />

      <div className="summary-grid">
        <div>
          <span className="summary-label">
            <span className="summary-dot income-dot" />
            Ingresos · {monthLabel}
          </span>
          <strong>{formatCurrency(income)}</strong>
        </div>

        <div>
          <span className="summary-label">
            <span className="summary-dot expense-dot" />
            Gastos · {monthLabel}
          </span>
          <strong>{formatCurrency(expenses)}</strong>
        </div>
      </div>
    </section>
  );
}
