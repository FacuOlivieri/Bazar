// Mirrors PermissionService: names are stored trimmed and in uppercase, so hasAuthority("X") always matches.
export const EMPTY_PERMISSION_DRAFT = { permissionName: '' };

// The token carries every authority in one comma-separated claim: a comma or a space inside a name would split it.
// "ver ventas" → "VER_VENTAS". Also used for role names.
export function normalizeAuthorityName(text) {
  return String(text ?? '')
    .toUpperCase()
    .replace(/[\s,]+/g, '_');
}

function trimUnderscores(name) {
  return name.replace(/^_+|_+$/g, '');
}

export function toPermissionDraft(permission) {
  return { permissionName: permission.permissionName };
}

// Body for POST /permissions/create and PUT /permissions/{id}.
export function toPermissionRequest(draft) {
  return { permissionName: trimUnderscores(normalizeAuthorityName(draft.permissionName)) };
}

export function validatePermissionDraft(draft) {
  return toPermissionRequest(draft).permissionName ? null : 'Escribí el nombre del permiso.';
}

export function matchesPermission(permission, query) {
  return permission.permissionName.includes(normalizeAuthorityName(query.trim()));
}

export function sortPermissions(permissions) {
  return [...permissions].sort((a, b) => a.permissionName.localeCompare(b.permissionName, 'es'));
}

// RoleDTO lists its permissions by name.
export function countRolesWithPermission(permissionName, roles) {
  return roles.filter((role) => role.permissions?.includes(permissionName)).length;
}
