import { sortNames } from '../../domain/role';

// Role or permission names inside a table cell, printed like labels on a box.
export function NameTags({ names, emptyLabel }) {
  const sorted = sortNames(names);
  if (sorted.length === 0) return <span className="name-tags__empty">{emptyLabel}</span>;

  return (
    <ul className="name-tags">
      {sorted.map((name) => (
        <li key={name} className="name-tag">
          {name}
        </li>
      ))}
    </ul>
  );
}
