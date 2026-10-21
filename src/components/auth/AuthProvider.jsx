import { useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../../api/authApi';
import { ApiError } from '../../api/httpClient';
import { clearToken, getToken, onSessionExpired, saveToken } from '../../api/session';
import { SESSION_END, isExpired, parseToken } from '../../domain/session';
import { AuthContext } from '../../hooks/useAuth';

function readStoredSession() {
  const token = getToken();
  const session = token ? parseToken(token) : null;
  if (isExpired(session)) {
    if (token) clearToken();
    return null;
  }
  return session;
}

// Keeps the logged-in user. The token expires after 30 minutes (JwtUtils): the session ends on its own
// at that moment, or earlier if the backend answers 401.
export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const [endReason, setEndReason] = useState(null);

  const expire = useCallback(() => {
    clearToken();
    setSession(null);
    setEndReason(SESSION_END.EXPIRED);
  }, []);

  useEffect(() => onSessionExpired(expire), [expire]);

  useEffect(() => {
    if (!session) return undefined;
    const timer = setTimeout(expire, Math.max(0, session.expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [session, expire]);

  // Logging out (or in) in another tab applies here too.
  useEffect(() => {
    function handleStorage() {
      setSession(readStoredSession());
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials);
    const nextSession = parseToken(response?.token ?? '');
    if (isExpired(nextSession)) {
      throw new ApiError(500, 'El servidor no devolvió una sesión válida.');
    }
    saveToken(nextSession.token);
    setEndReason(null);
    setSession(nextSession);
    return nextSession;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setEndReason(null);
    setSession(null);
  }, []);

  const value = useMemo(() => ({ session, endReason, login, logout }), [session, endReason, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
