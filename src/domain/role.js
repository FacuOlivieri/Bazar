import { normalizeAuthorityName } from './permission';

// Mirrors RoleService: uppercase name without "ROLE_" (UserDetailsServiceImp adds it), permissions by name.
const ROLE_PREFIX = 'ROLE_';

export const EMPTY_ROLE_DRAFT = { role: '', permissions: [] };

// The controllers authorize with hasRole('ADMIN') / hasAnyRole('ADMIN', 'EMPLEADO'): any other role name
// is stored fine but opens no screen (only Cupones, which asks for nothing but a session).
export const ROLES_WITH_ACCESS = ['ADMIN', 'EMPLEADO'];

export function grantsAccess(roleName) {
  return ROLES_WITH_ACCESS.includes(toRoleName(roleName));
}

export function hasRolePrefix(text) {
  return normalizeAuthorityName(text).startsWith(ROLE_PREFIX);
}

function toRoleName(text) {
  const name = normalizeAuthorityName(text).replace(/^_+|_+$/g, '');
  return name.startsWith(ROLE_PREFIX) ? name.slice(ROLE_PREFIX.length) : name;
}

export function toRoleDraft(role) {
  return { role: role.role, permissions: [...(role.permissions ?? [])] };
}

// Body for POST /roles/create and PUT /roles/{id}.
export function toRoleRequest(draft) {
  return { role: toRoleName(draft.role), permissions: [...draft.permissions].sort() };
}

export function validateRoleDraft(draft) {
  return toRoleRequest(draft).role ? null : 'Escribí el nombre del rol.';
}

export function matchesRole(role, query) {
  const wanted = normalizeAuthorityName(query.trim());
  return role.role.includes(wanted) || (role.permissions ?? []).some((permission) => permission.includes(wanted));
}

export function sortRoles(roles) {
  return [...roles].sort((a, b) => a.role.localeCompare(b.role, 'es'));
}

// UserDTO lists its roles by name.
export function countUsersWithRole(roleName, users) {
  return users.filter((user) => user.roles?.includes(roleName)).length;
}

export function sortNames(names) {
  return [...(names ?? [])].sort((a, b) => a.localeCompare(b, 'es'));
}
