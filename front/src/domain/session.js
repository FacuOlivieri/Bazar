// What the front needs from the JWT that JwtUtils signs: `sub` is the username, `authorities` is
// "ROLE_ADMIN,READ,CREATE" (roles with the ROLE_ prefix, permissions as they are) and `exp` is in seconds.
const ROLE_PREFIX = 'ROLE_';

// Why the last session ended, so the login can say it (an explicit logout leaves no reason).
export const SESSION_END = { EXPIRED: 'expired' };

function decodeBase64Url(segment) {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(segment.length / 4) * 4, '=');
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

// Only reads the payload: the signature is checked by the backend on every request.
export function parseToken(token) {
  try {
    const payload = JSON.parse(decodeBase64Url(token.split('.')[1]));
    const authorities = String(payload.authorities ?? '')
      .split(',')
      .map((authority) => authority.trim())
      .filter(Boolean);
    return { token, username: payload.sub, authorities, expiresAt: Number(payload.exp) * 1000 };
  } catch {
    return null;
  }
}

export function isExpired(session, now = Date.now()) {
  return !session || !Number.isFinite(session.expiresAt) || session.expiresAt <= now;
}

export function hasRole(session, role) {
  return Boolean(session?.authorities.includes(ROLE_PREFIX + role));
}

// "ROLE_ADMIN" → "ADMIN"; plain permissions are left out.
export function rolesOf(session) {
  return (session?.authorities ?? []).filter((authority) => authority.startsWith(ROLE_PREFIX)).map((authority) => authority.slice(ROLE_PREFIX.length));
}

// Spring Security's exceptions reach the front in English (and as 500, there is no @ControllerAdvice yet).
const LOGIN_ERRORS = [
  { pattern: /disabled/i, message: 'La cuenta está deshabilitada. Pedile a un administrador que la habilite.' },
  { pattern: /locked/i, message: 'La cuenta está bloqueada. Pedile a un administrador que la desbloquee.' },
  { pattern: /credentials have expired/i, message: 'La contraseña venció. Pedile a un administrador que te asigne una nueva.' },
  { pattern: /expired/i, message: 'La cuenta venció. Pedile a un administrador que la renueve.' }
];

export function describeLoginError(error) {
  if (error.status === 0) return error.message;
  const known = LOGIN_ERRORS.find(({ pattern }) => pattern.test(error.message));
  return known ? known.message : 'Usuario o contraseña incorrectos.';
}
