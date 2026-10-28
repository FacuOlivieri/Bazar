import { pluralize } from '../../domain/format';

// Pick several names from a list (permissions of a role, roles of a user). `selected` and `options` are names.
// `empty` is shown when there is nothing to pick yet.
export function CheckList({ id, legend, options, selected, onChange, empty }) {
  const selectedSet = new Set(selected);
  // A name assigned in the backend that is no longer listed still shows, so saving doesn't drop it silently.
  const names = [...new Set([...options, ...selected])];

  function toggle(name, isChecked) {
    onChange(isChecked ? [...selected, name] : selected.filter((current) => current !== name));
  }

  return (
    <fieldset className="check-list">
      <legend className="check-list__legend">
        <span className="field-label">{legend}</span>
        <span className="check-list__count num">{pluralize(selected.length, 'elegido', 'elegidos')}</span>
      </legend>
      {names.length === 0 ? (
        <div className="check-list__empty helper-text">{empty}</div>
      ) : (
        <ul className="check-list__options">
          {names.map((name) => {
            const optionId = `${id}-${name}`;
            return (
              <li key={name}>
                <label className="check-list__option" htmlFor={optionId}>
                  <input id={optionId} type="checkbox" checked={selectedSet.has(name)} onChange={(event) => toggle(name, event.target.checked)} />
                  <span className="name-code">{name}</span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </fieldset>
  );
}
