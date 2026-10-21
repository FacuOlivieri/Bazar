import { useState } from 'react';
import { InlineError } from '../../components/ui/Feedback';
import { Field } from '../../components/ui/RecordForm';
import { EMPTY_PERMISSION_DRAFT, normalizeAuthorityName, toPermissionDraft, toPermissionRequest, validatePermissionDraft } from '../../domain/permission';

// Create (permission = null) or rename a permission. Renaming it renames it in every role that has it.
export function PermissionForm({ permission, onSave, onCancel, isBusy, error }) {
  const [draft, setDraft] = useState(() => (permission ? toPermissionDraft(permission) : EMPTY_PERMISSION_DRAFT));
  const [validationError, setValidationError] = useState(null);
  const isEditing = Boolean(permission);

  function handleSubmit(event) {
    event.preventDefault();
    const problem = validatePermissionDraft(draft);
    setValidationError(problem);
    if (!problem) onSave(toPermissionRequest(draft));
  }

  return (
    <form className="record-form side-column__body" onSubmit={handleSubmit} noValidate>
      <Field
        id="p-name"
        label="Nombre del permiso"
        type="text"
        autoComplete="off"
        className="input name-code"
        placeholder="VER_VENTAS"
        hint="Se guarda en mayúsculas y con guion bajo en lugar de espacios."
        value={draft.permissionName}
        onChange={(event) => setDraft({ permissionName: normalizeAuthorityName(event.target.value) })}
      />

      {isEditing && <p className="helper-text">Si le cambiás el nombre, cambia también en los roles que lo tienen.</p>}

      {(validationError || error) && <InlineError>{validationError ?? error}</InlineError>}

      <div className="record-form__actions">
        <button type="submit" className="btn btn--primary record-form__submit" disabled={isBusy}>
          {isEditing ? 'Guardar cambios' : 'Crear permiso'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
