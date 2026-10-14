import type { Transaction } from "../types";
import { formatShortDate, formatSignedCurrency } from "../lib/format";

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  return (
    <article className="transaction-item">
      <div className="transaction-icon" aria-hidden="true">
        {transaction.icon}
      </div>

      <div className="transaction-info">
        <strong>{transaction.title}</strong>
        <span>
          {transaction.category} · {formatShortDate(transaction.date)}
        </span>
      </div>

      <strong className={`transaction-amount ${transaction.type}`}>
        {formatSignedCurrency(transaction.amount, transaction.type)}
      </strong>
    </article>
  );
}
