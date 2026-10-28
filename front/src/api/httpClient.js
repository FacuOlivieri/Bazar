import { getToken, notifySessionExpired } from './session';

const BASE_URL = '/api/v1';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Bean Validation failures arrive as Hibernate's dump; the readable part is each interpolatedMessage.
const VALIDATION_DUMP = /interpolatedMessage='([^']*)'/g;
// Database and framework errors are written for developers, not for the counter.
const TECHNICAL_MESSAGE = /exception|sql|could not|constraint|statement|\n/i;

// The backend sends business errors as 500 with a Spanish `message`. Spring's `error` field
// ("Internal Server Error") and technical messages never reach the screen: those fall back to the bare status.
async function readErrorMessage(response) {
  const bareStatus = `El servidor respondió ${response.status}`;
  const data = await response.json().catch(() => null);
  const message = data?.message ?? '';
  const violations = [...message.matchAll(VALIDATION_DUMP)].map((match) => match[1]);
  if (violations.length > 0) return violations.join('. ');
  if (!message || TECHNICAL_MESSAGE.test(message)) return bareStatus;
  return message;
}

function buildHeaders(body, token) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// `authenticated: false` is for /auth/login: no token is sent and a 401 there is a wrong password, not an expired session.
export async function requestJson(url, { method = 'GET', body, authenticated = true } = {}) {
  const token = authenticated ? getToken() : null;
  let response;
  try {
    response = await fetch(url, {
      method,
      headers: buildHeaders(body, token),
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ApiError(0, 'No hay conexión con el servidor del bazar.');
  }

  if (authenticated && response.status === 401) {
    notifySessionExpired();
    throw new ApiError(401, 'Tu sesión venció. Volvé a entrar.');
  }
  if (authenticated && response.status === 403) {
    throw new ApiError(403, 'Tu usuario no tiene permiso para esta acción.');
  }
  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }
  return response.status === 204 ? null : response.json();
}

const request = (path, options) => requestJson(BASE_URL + path, options);

export const http = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' })
};
