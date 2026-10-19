import { useState } from 'react';
import { InlineError } from '../../components/ui/Feedback';
import { Icon } from '../../components/ui/Icon';
import { Field } from '../../components/ui/RecordForm';
import {
  dniDigits,
  EMPTY_CLIENT_DRAFT,
  formatDni,
  formatPhone,
  hasInvalidPhoneChars,
  phoneDigits,
  toClientDraft,
  toClientRequest
} from '../../domain/client';

// Create (client = null) or edit a client. The phone only keeps digits; the backend checks it too.
export function ClientForm({ client, onSave, onCancel, isBusy, error }) {
  const [draft, setDraft] = useState(() => (client ? toClientDraft(client) : EMPTY_CLIENT_DRAFT));
  const [rejectedPhoneInput, setRejectedPhoneInput] = useState(false);
  const isEditing = Boolean(client);

  function updatePhone(event) {
    setRejectedPhoneInput(hasInvalidPhoneChars(event.target.value));
    setField('phone', phoneDigits(event.target.value));
  }

  function setField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function textField(field) {
    return (event) => setField(field, event.target.value);
  }

  function digitsField(field) {
    return (event) => setField(field, dniDigits(event.target.value));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(toClientRequest(draft));
  }

  return (
    <form className="record-form side-column__body" onSubmit={handleSubmit}>
      <div className="record-form__row">
        <Field id="c-name" label="Nombre" type="text" autoComplete="off" value={draft.name} onChange={textField('name')} />
        <Field id="c-surname" label="Apellido" type="text" autoComplete="off" value={draft.surname} onChange={textField('surname')} />
      </div>
      <div className="record-form__row">
        <Field
          id="c-dni"
          label="DNI"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          className="input num"
          value={formatDni(draft.dni)}
          onChange={digitsField('dni')}
        />
        <Field
          id="c-phone"
          label="Teléfono"
          type="tel"
          inputMode="numeric"
          autoComplete="off"
          className="input num"
          placeholder="11 5555-6666"
          aria-describedby={rejectedPhoneInput ? 'c-phone-hint' : undefined}
          value={formatPhone(draft.phone)}
          onChange={updatePhone}
        />
      </div>
      {rejectedPhoneInput && (
        <p id="c-phone-hint" className="field-hint" role="alert">
          <Icon name="alert" size={16} strokeWidth={2.6} />
          El teléfono solo lleva números: las letras y los símbolos no se guardan.
        </p>
      )}
      <Field id="c-email" label="Email" type="email" autoComplete="off" placeholder="nombre@correo.com" value={draft.email} onChange={textField('email')} />
      <Field id="c-address" label="Dirección" type="text" autoComplete="off" placeholder="Calle 123, barrio" value={draft.address} onChange={textField('address')} />

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
