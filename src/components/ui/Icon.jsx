const PATHS = {
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5L21 21" />
    </>
  ),
  plus: <path d="M12 4v16M4 12h16" />,
  minus: <path d="M4 12h16" />,
  trash: <path d="M4 7h16M9 7V4h6v3M6.5 7l1.2 13h8.6l1.2-13" />,
  check: <path d="M4 12.5l5 5L20 7" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  arrowRight: <path d="M3 12h16M13 6l6 6-6 6" />,
  alert: <path d="M12 4v10M12 18.5v.5" />
};

export function Icon({ name, size = 20, strokeWidth = 2.2, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
