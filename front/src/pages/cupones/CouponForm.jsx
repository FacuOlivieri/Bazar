import { useState } from 'react';
import { InlineError } from '../../components/ui/Feedback';
import { Field } from '../../components/ui/RecordForm';
import { EMPTY_COUPON_DRAFT, MAX_DISCOUNT, normalizeIdentifier, toCouponDraft, toCouponRequest } from '../../domain/coupon';

// Create (coupon = null) or edit a coupon. New coupons always start unused (the backend enforces it).
export function CouponForm({ coupon, onSave, onCancel, isBusy, error }) {
  const [draft, setDraft] = useState(() => (coupon ? toCouponDraft(coupon) : EMPTY_COUPON_DRAFT));
  const isEditing = Boolean(coupon);

  function setField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(toCouponRequest(draft));
  }

  return (
    <form className="record-form side-column__body" onSubmit={handleSubmit}>
      <div className="record-form__row">
        <Field
          id="k-identifier"
          label="Código"
          type="text"
          autoComplete="off"
          className="input coupon-input"
          placeholder="VERANO10"
          value={draft.identifier}
          onChange={(event) => setField('identifier', normalizeIdentifier(event.target.value))}
        />
        <Field
          id="k-discount"
          label="Descuento %"
          type="number"
          min="1"
          max={MAX_DISCOUNT}
          step="0.5"
          className="input num"
          placeholder="10"
          value={draft.discount}
          onChange={(event) => setField('discount', event.target.value)}
        />
      </div>

      {isEditing && (
        <label className="check-field" htmlFor="k-used">
          <input id="k-used" type="checkbox" checked={draft.used} onChange={(event) => setField('used', event.target.checked)} />
          <span>Ya fue usado</span>
        </label>
      )}

      <p className="helper-text">El cliente lo dice en el mostrador y el descuento se aplica sobre el total de la venta. Cada cupón sirve una sola vez.</p>

      {error && <InlineError>{error}</InlineError>}

      <div className="record-form__actions">
        <button type="submit" className="btn btn--primary record-form__submit" disabled={isBusy}>
          {isEditing ? 'Guardar cambios' : 'Crear cupón'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
