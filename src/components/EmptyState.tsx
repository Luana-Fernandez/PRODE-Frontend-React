import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon = 'bi-inboxes', title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <i className={`bi ${icon}`} />
      <h5 className="mb-1">{title}</h5>
      {description && <p className="mb-3 small">{description}</p>}
      {action}
    </div>
  );
}