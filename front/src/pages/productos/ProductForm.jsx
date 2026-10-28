import { useState } from 'react';
import { InlineError } from '../../components/ui/Feedback';
import { Field } from '../../components/ui/RecordForm';
import { EMPTY_DRAFT, toDraft, toProductRequest } from '../../domain/product';

// Create (product = null) or edit a product. Validation rules are pending (see TODO.md).
export function ProductForm({ product, onSave, onCancel, isBusy, error }) {
  const [draft, setDraft] = useState(() => (product ? toDraft(product) : EMPTY_DRAFT));
  const isEditing = Boolean(product);

  function updateField(field) {
    return (event) => setDraft((current) => ({ ...current, [field]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(toProductRequest(draft));
  }

  return (
    <form className="record-form side-column__body" onSubmit={handleSubmit}>
      <Field id="f-name" label="Nombre" type="text" value={draft.name} onChange={updateField('name')} />
      <Field id="f-brand" label="Marca" type="text" value={draft.brand} onChange={updateField('brand')} />
      <div className="record-form__row">
        <Field id="f-price" label="Precio $" type="number" min="0" className="input num" value={draft.price} onChange={updateField('price')} />
        <Field id="f-stock" label="Stock (u.)" type="number" min="0" className="input num" value={draft.stock} onChange={updateField('stock')} />
      </div>

      {error && <InlineError>{error}</InlineError>}

      <div className="record-form__actions">
        <button type="submit" className="btn btn--primary record-form__submit" disabled={isBusy}>
          {isEditing ? 'Guardar cambios' : 'Crear producto'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
