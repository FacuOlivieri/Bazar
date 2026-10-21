import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckList } from '../../components/ui/CheckList';
import { InlineError } from '../../components/ui/Feedback';
import { Field } from '../../components/ui/RecordForm';
import { EMPTY_USER_DRAFT, MIN_PASSWORD_LENGTH, toUserDraft, toUserRequest, validateUserDraft } from '../../domain/user';

// Account flags in shop terms. Only «Habilitado» is offered for a new user; the rest are for later.
const ACCOUNT_FLAGS = [
  { field: 'enabled', label: 'Habilitado', hint: 'Sin esto no puede entrar hasta que lo vuelvas a habilitar.', onCreate: true },
  { field: 'locked', label: 'Bloqueado', hint: 'Corta el ingreso, por ejemplo si dejó de trabajar en el local.' },
  { field: 'expired', label: 'Cuenta vencida', hint: 'La cuenta dejó de tener validez.' },
  { field: 'credentialsExpired', label: 'Contraseña vencida', hint: 'Para volver a entrar necesita una contraseña nueva.' }
];

function AccountFlags({ draft, isEditing, onChange }) {
  const flags = ACCOUNT_FLAGS.filter((flag) => isEditing || flag.onCreate);
  return (
    <fieldset className="check-group">
      <legend className="field-label">Estado de la cuenta</legend>
      {flags.map((flag) => (
        <label key={flag.field} className="check-group__option" htmlFor={`u-${flag.field}`}>
          <input id={`u-${flag.field}`} type="checkbox" checked={draft[flag.field]} onChange={(event) => onChange(flag.field, event.target.checked)} />
          <span className="check-group__text">
            {flag.label}
            <span className="helper-text">{flag.hint}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}

// Create (user = null) or edit a user. The password is only sent when something is typed.
export function UserForm({ user, isSelf, roleNames, onSave, onCancel, isBusy, error }) {
  const [draft, setDraft] = useState(() => (user ? toUserDraft(user) : EMPTY_USER_DRAFT));
  const [validationError, setValidationError] = useState(null);
  const isEditing = Boolean(user);

  function setField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const problem = validateUserDraft(draft, isEditing);
    setValidationError(problem);
    if (!problem) onSave(toUserRequest(draft));
  }

  const losesAdmin = isSelf && user.roles?.includes('ADMIN') && !draft.roles.includes('ADMIN');

  return (
    <form className="record-form side-column__body" onSubmit={handleSubmit} noValidate>
      <Field
        id="u-username"
        label="Usuario"
        type="text"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="lucia"
        value={draft.username}
        onChange={(event) => setField('username', event.target.value)}
      />
      <Field
        id="u-password"
        label={isEditing ? 'Contraseña nueva' : 'Contraseña'}
        type="password"
        autoComplete="new-password"
        hint={isEditing ? 'Dejala vacía para no cambiarla.' : `Al menos ${MIN_PASSWORD_LENGTH} caracteres. Pasásela al usuario en persona.`}
        value={draft.password}
        onChange={(event) => setField('password', event.target.value)}
      />

      <CheckList
        id="u-roles"
        legend="Roles"
        options={roleNames}
        selected={draft.roles}
        onChange={(roles) => setField('roles', roles)}
        empty={
          <>
            Todavía no hay roles. Crealos en <Link to="/roles">Roles</Link>.
          </>
        }
      />

      <AccountFlags draft={draft} isEditing={isEditing} onChange={setField} />

      {losesAdmin && <p className="helper-text">Te estás sacando el rol ADMIN: la próxima vez que entres no vas a ver Usuarios, Roles ni Permisos.</p>}
      {isEditing && <p className="helper-text">Los cambios de roles se aplican la próxima vez que el usuario entre.</p>}

      {(validationError || error) && <InlineError>{validationError ?? error}</InlineError>}

      <div className="record-form__actions">
        <button type="submit" className="btn btn--primary record-form__submit" disabled={isBusy}>
          {isEditing ? 'Guardar cambios' : 'Crear usuario'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
