// Mirrors UserService: the password needs 8 characters and is never sent back; on update,
// an empty password or a missing field keeps what is stored.
export const MIN_PASSWORD_LENGTH = 8;

// The form speaks in shop terms ("Bloqueado"); UserDTO uses the inverted Spring flags (accountNotLocked).
export const EMPTY_USER_DRAFT = {
  username: '',
  password: '',
  roles: [],
  enabled: true,
  locked: false,
  expired: false,
  credentialsExpired: false
};

export function toUserDraft(user) {
  return {
    username: user.username,
    password: '',
    roles: [...(user.roles ?? [])],
    enabled: user.enabled !== false,
    locked: user.accountNotLocked === false,
    expired: user.accountNotExpired === false,
    credentialsExpired: user.credentialNotExpired === false
  };
}

// Body for POST /users/create and PUT /users/{id}.
export function toUserRequest(draft) {
  const request = {
    username: draft.username.trim(),
    roles: [...draft.roles].sort(),
    enabled: draft.enabled,
    accountNotLocked: !draft.locked,
    accountNotExpired: !draft.expired,
    credentialNotExpired: !draft.credentialsExpired
  };
  if (draft.password) request.password = draft.password;
  return request;
}

export function validateUserDraft(draft, isEditing) {
  if (!draft.username.trim()) return 'Escribí el nombre de usuario.';
  if (!isEditing && !draft.password) return 'Escribí una contraseña para el usuario nuevo.';
  if (draft.password && draft.password.length < MIN_PASSWORD_LENGTH) {
    return `La contraseña necesita al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  return null;
}

// The first flag that keeps the user out, in the order Spring checks them at login.
export function userStatus(user) {
  if (user.accountNotLocked === false) return { key: 'locked', label: 'Bloqueado' };
  if (user.enabled === false) return { key: 'disabled', label: 'Deshabilitado' };
  if (user.accountNotExpired === false) return { key: 'expired', label: 'Cuenta vencida' };
  if (user.credentialNotExpired === false) return { key: 'credentials', label: 'Contraseña vencida' };
  return { key: 'active', label: 'Activo' };
}

export function isActiveUser(user) {
  return userStatus(user).key === 'active';
}

export function matchesUser(user, query) {
  const wanted = query.trim().toLowerCase();
  return user.username.toLowerCase().includes(wanted) || (user.roles ?? []).some((role) => role.toLowerCase().includes(wanted));
}

export function sortUsers(users) {
  return [...users].sort((a, b) => a.username.localeCompare(b.username, 'es'));
}
