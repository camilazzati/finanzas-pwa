import type { ReactNode } from "react";
import type { Transaction } from "../types";
import { TransactionItem } from "./TransactionItem";
import { EmptyState } from "./EmptyState";

interface TransactionListProps {
  transactions: Transaction[];
  emptyIcon?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}

export function TransactionList({
  transactions,
  emptyIcon = "🧾",
  emptyTitle = "Todavía no hay movimientos",
  emptyDescription = "Registrá tu primer ingreso o gasto para verlo acá.",
  emptyAction,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
}
