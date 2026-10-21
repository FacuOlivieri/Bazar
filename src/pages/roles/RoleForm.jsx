import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckList } from '../../components/ui/CheckList';
import { InlineError } from '../../components/ui/Feedback';
import { Field } from '../../components/ui/RecordForm';
import { normalizeAuthorityName } from '../../domain/permission';
import { EMPTY_ROLE_DRAFT, grantsAccess, hasRolePrefix, toRoleDraft, toRoleRequest, validateRoleDraft } from '../../domain/role';

// Create (role = null) or edit a role: its name and which permissions it groups.
export function RoleForm({ role, permissionNames, onSave, onCancel, isBusy, error }) {
  const [draft, setDraft] = useState(() => (role ? toRoleDraft(role) : EMPTY_ROLE_DRAFT));
  const [validationError, setValidationError] = useState(null);
  const isEditing = Boolean(role);

  function setField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const problem = validateRoleDraft(draft);
    setValidationError(problem);
    if (!problem) onSave(toRoleRequest(draft));
  }

  return (
    <form className="record-form side-column__body" onSubmit={handleSubmit} noValidate>
      <Field
        id="r-name"
        label="Nombre del rol"
        type="text"
        autoComplete="off"
        className="input name-code"
        placeholder="CAJERO"
        hint={hasRolePrefix(draft.role) ? 'No hace falta escribir ROLE_: se guarda sin eso y el sistema lo agrega solo.' : 'Se guarda en mayúsculas, por ejemplo ADMIN o EMPLEADO.'}
        value={draft.role}
        onChange={(event) => setField('role', normalizeAuthorityName(event.target.value))}
      />

      <CheckList
        id="r-permissions"
        legend="Permisos del rol"
        options={permissionNames}
        selected={draft.permissions}
        onChange={(permissions) => setField('permissions', permissions)}
        empty={
          <>
            Todavía no hay permisos. Crealos en <Link to="/permisos">Permisos</Link>.
          </>
        }
      />

      {draft.role.trim() && !grantsAccess(draft.role) && (
        <p className="helper-text">
          Las pantallas se abren por rol: ADMIN maneja todo y EMPLEADO atiende el mostrador. Un rol con otro nombre se guarda, pero solo deja entrar a Cupones.
        </p>
      )}
      <p className="helper-text">Los cambios llegan a cada usuario la próxima vez que entre al sistema.</p>

      {(validationError || error) && <InlineError>{validationError ?? error}</InlineError>}

      <div className="record-form__actions">
        <button type="submit" className="btn btn--primary record-form__submit" disabled={isBusy}>
          {isEditing ? 'Guardar cambios' : 'Crear rol'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
