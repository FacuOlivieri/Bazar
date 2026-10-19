import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/mostrador', label: 'Mostrador', shortcut: 'F1' },
  { to: '/productos', label: 'Productos', shortcut: 'F3' },
  { to: '/clientes', label: 'Clientes', shortcut: 'F4' },
  { to: '/cupones', label: 'Cupones', shortcut: 'F6' }
];

function navLinkClass({ isActive }) {
  return isActive ? 'nav-link is-current' : 'nav-link';
}

function Rail({ footer }) {
  return (
    <nav className="rail" aria-label="Secciones">
      <div>
        <p className="rail__brand">BAZAR</p>
        <p className="rail__subtitle">Gestión del local</p>
      </div>
      <div className="rail__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} className={navLinkClass}>
            {item.label} <kbd className="nav-link__kbd">{item.shortcut}</kbd>
          </NavLink>
        ))}
      </div>
      {footer && <div className="rail__footer">{footer}</div>}
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
