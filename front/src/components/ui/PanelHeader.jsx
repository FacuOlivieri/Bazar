export function PanelHeader({ title, subtitle }) {
  return (
    <header className="panel-header on-dark">
      <h2 className="panel-header__title">{title}</h2>
      {subtitle && <p className="panel-header__subtitle">{subtitle}</p>}
    </header>
  );
}
