import { useState } from 'react';
import { InlineError } from '../../components/ui/Feedback';
import { Field } from '../../components/ui/RecordForm';
import { dniDigits, EMPTY_CLIENT_DRAFT, formatDni, toClientDraft, toClientRequest } from '../../domain/client';

// Create (client = null) or edit a client. Validation rules are pending (see TODO.md).
export function ClientForm({ client, onSave, onCancel, isBusy, error }) {
  const [draft, setDraft] = useState(() => (client ? toClientDraft(client) : EMPTY_CLIENT_DRAFT));
  const isEditing = Boolean(client);

  function updateField(field) {
    return (event) => setDraft((current) => ({ ...current, [field]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(toClientRequest(draft));
  }

  return (
    <form className="record-form side-column__body" onSubmit={handleSubmit}>
      <div className="record-form__row">
        <Field id="c-name" label="Nombre" type="text" autoComplete="off" value={draft.name} onChange={updateField('name')} />
        <Field id="c-surname" label="Apellido" type="text" autoComplete="off" value={draft.surname} onChange={updateField('surname')} />
      </div>
      <Field
        id="c-dni"
        label="DNI"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        className="input num"
        value={formatDni(draft.dni)}
        onChange={(event) => setDraft((current) => ({ ...current, dni: dniDigits(event.target.value) }))}
      />

      {error && <InlineError>{error}</InlineError>}

      <div className="record-form__actions">
        <button type="submit" className="btn btn--primary record-form__submit" disabled={isBusy}>
          {isEditing ? 'Guardar cambios' : 'Crear cliente'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
