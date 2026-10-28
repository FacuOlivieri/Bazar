import { Icon } from './Icon';

export function EmptyState({ title, hint }) {
  return (
    <div className="empty-state">
      <p className="empty-state__title">{title}</p>
      {hint && <p className="helper-text">{hint}</p>}
    </div>
  );
}

// Positive confirmation: carton tint, ink border, drawn check. Never green.
export function Notice({ children, className = '' }) {
  return (
    <div role="status" className={`notice ${className}`}>
      <Icon name="check" size={20} strokeWidth={2.4} />
      <span>{children}</span>
    </div>
  );
}

// Something went wrong: ink, not red (red is reserved for urgency).
export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="error-state">
      <p className="empty-state__title">No se pudo cargar</p>
      <p className="helper-text">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--ghost" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export function InlineError({ children }) {
  return (
    <div role="alert" className="inline-error">
      <Icon name="alert" size={18} strokeWidth={2.6} />
      <span>{children}</span>
    </div>
  );
}

export function SkeletonRows({ columns, rows = 6 }) {
  return Array.from({ length: rows }, (_, row) => (
    <tr key={row} className="skeleton-row" aria-hidden="true">
      {Array.from({ length: columns }, (_, column) => (
        <td key={column}>
          <span className="skeleton-bar" />
        </td>
      ))}
    </tr>
  ));
}
