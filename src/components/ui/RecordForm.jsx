import { useState } from 'react';

export function Field({ id, label, ...inputProps }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input id={id} className="input" {...inputProps} />
    </div>
  );
}

// Last cell of a table row: Editar and Eliminar side by side; Eliminar asks once, in place.
export function RowActions({ recordName, onEdit, onDelete, isBusy }) {
  const [isConfirming, setIsConfirming] = useState(false);

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
      <button type="button" className="link-btn" onClick={onEdit} aria-label={`Editar ${recordName}`}>
        Editar
      </button>
      <button type="button" className="link-btn link-btn--quiet" onClick={() => setIsConfirming(true)} aria-label={`Eliminar ${recordName}`}>
        Eliminar
      </button>
    </span>
  );
}
