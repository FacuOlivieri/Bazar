import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { hasRole } from '../../domain/session';
import { useAuth } from '../../hooks/useAuth';

// Layout route: without a session goes to the login (and comes back here after it);
// with `role`, a user without that role goes back to the counter.
export function RequireAuth({ role }) {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  if (role && !hasRole(session, role)) {
    return <Navigate to="/mostrador" replace />;
  }
  return <Outlet />;
}
