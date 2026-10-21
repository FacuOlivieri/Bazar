import { NavLink, useNavigate } from 'react-router-dom';
import { hasRole, rolesOf } from '../../domain/session';
import { useAuth } from '../../hooks/useAuth';
import { Icon } from '../ui/Icon';

const NAV_ITEMS = [
  { to: '/mostrador', label: 'Mostrador', shortcut: 'F1' },
  { to: '/productos', label: 'Productos', shortcut: 'F3' },
  { to: '/clientes', label: 'Clientes', shortcut: 'F4' },
  { to: '/cupones', label: 'Cupones', shortcut: 'F6' },
  { to: '/ventas', label: 'Ventas', shortcut: 'F7' }
];

// Only for ROLE_ADMIN. No F keys: these screens are not used with a customer waiting.
const ADMIN_ITEMS = [
  { to: '/usuarios', label: 'Usuarios' },
  { to: '/roles', label: 'Roles' },
  { to: '/permisos', label: 'Permisos' }
];

function navLinkClass({ isActive }) {
  return isActive ? 'nav-link is-current' : 'nav-link';
}

function NavItem({ item }) {
  return (
    <NavLink to={item.to} className={navLinkClass}>
      {item.label} {item.shortcut && <kbd className="nav-link__kbd">{item.shortcut}</kbd>}
    </NavLink>
  );
}

function Account() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const roles = rolesOf(session);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="rail__account">
      <p className="rail__account-name">
        <Icon name="user" size={16} strokeWidth={2.4} />
        <span>{session.username}</span>
      </p>
      {roles.length > 0 && <p className="rail__account-roles">{roles.join(' · ')}</p>}
      <button type="button" className="link-btn rail__logout" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}

function Rail({ footer }) {
  const { session } = useAuth();
  const isAdmin = hasRole(session, 'ADMIN');

  return (
    <nav className="rail" aria-label="Secciones">
      <div>
        <p className="rail__brand">BAZAR</p>
        <p className="rail__subtitle">Gestión del local</p>
      </div>
      <div className="rail__nav">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} item={item} />
        ))}
        {isAdmin && (
          <>
            <p className="rail__group-label">Administración</p>
            {ADMIN_ITEMS.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </>
        )}
      </div>
      <div className="rail__bottom">
        {footer && <div className="rail__footer">{footer}</div>}
        {session && <Account />}
      </div>
    </nav>
  );
}

// Three-column module: kraft rail, work area and side column (each page renders the last two).
export function AppShell({ railFooter, children }) {
  return (
    <div className="shell">
      <Rail footer={railFooter} />
      {children}
    </div>
  );
}
