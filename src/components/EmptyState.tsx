import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span aria-hidden="true">{icon}</span>
      <strong>{title}</strong>
      <p>{description}</p>
      {action}
    </div>
  );
}
