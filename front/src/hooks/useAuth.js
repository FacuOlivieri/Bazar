import { createContext, useContext } from 'react';
import { hasRole } from '../domain/session';

export const AuthContext = createContext(null);

// { session, endReason, login, logout } from AuthProvider. `session` is null while logged out.
export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('useAuth needs an <AuthProvider> above it.');
  return auth;
}

// The backend keeps prices, stock, deleting clients, editing sales, the day summary and the
// security screens for ROLE_ADMIN (@PreAuthorize): the front hides those actions from everyone else.
export function useIsAdmin() {
  return hasRole(useAuth().session, 'ADMIN');
}
