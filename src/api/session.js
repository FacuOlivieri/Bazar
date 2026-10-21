// The JWT from POST /auth/login. Lives outside React so httpClient can read it on every request.
const STORAGE_KEY = 'bazar.session';

const expiredListeners = new Set();

export function getToken() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveToken(token) {
  try {
    localStorage.setItem(STORAGE_KEY, token);
  } catch {
    // Private mode or blocked storage: the session still works until the tab is reloaded.
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing stored to clear.
  }
}

// The backend rejected the token (401): whoever listens sends the user back to the login.
export function onSessionExpired(listener) {
  expiredListeners.add(listener);
  return () => expiredListeners.delete(listener);
}

export function notifySessionExpired() {
  clearToken();
  expiredListeners.forEach((listener) => listener());
}
