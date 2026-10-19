import { Icon } from './Icon';

// `variant="large"` is the counter search box; `variant="inline"` sits on a rule (Productos filter).
export function SearchField({ id, label, value, onChange, placeholder, shortcut, variant = 'large', inputRef }) {
  return (
    <div className={`search search--${variant}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Icon name="search" size={variant === 'large' ? 24 : 20} />
      <input
        ref={inputRef}
        id={id}
        className="search__input"
        type="search"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {shortcut && <kbd className="search__kbd">{shortcut}</kbd>}
    </div>
  );
}
