import { useState } from 'react';

export function Field({ id, label, hint, ...inputProps }) {
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className="form-field">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input id={id} className="input" aria-describedby={hintId} {...inputProps} />
      {hint && (
        <p id={hintId} className="helper-text form-field__hint">
          {hint}
        </p>
      )}
    </div>
  );
}

// Last cell of a table row: Editar and Eliminar side by side; Eliminar asks once, in place.
// With `deleteBlockedReason`, Eliminar explains why the record can't go instead of asking.
// Without `onEdit` or `onDelete` (the user's role can't do it), that link is left out.
export function RowActions({ recordName, onEdit, onDelete, isBusy, deleteBlockedReason }) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (isConfirming && deleteBlockedReason) {
    return (
      <span className="row-actions row-actions--confirm" role="status">
        <span className="row-actions__reason">{deleteBlockedReason}</span>
        <button type="button" className="link-btn" onClick={() => setIsConfirming(false)}>
          Entendido
        </button>
      </span>
    );
  }

  if (isConfirming) {
    return (
      <span className="row-actions row-actions--confirm" role="group" aria-label={`Confirmar eliminar ${recordName}`}>
        <span className="row-actions__question">¿Eliminar?</span>
        <button
          type="button"
          className="link-btn link-btn--danger"
          disabled={isBusy}
          onClick={() => {
            setIsConfirming(false);
            onDelete();
          }}
        >
          Sí
        </button>
        <button type="button" className="link-btn" onClick={() => setIsConfirming(false)}>
          No
        </button>
      </span>
    );
  }

  return (
    <span className="row-actions">
      {onEdit && (
        <button type="button" className="link-btn" onClick={onEdit} aria-label={`Editar ${recordName}`}>
          Editar
        </button>
      )}
      {onDelete && (
        <button type="button" className="link-btn link-btn--quiet" onClick={() => setIsConfirming(true)} aria-label={`Eliminar ${recordName}`}>
          Eliminar
        </button>
      )}
    </span>
  );
}
