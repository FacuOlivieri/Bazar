function normalize(text) {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

// True when the query is empty or any of the values contains it (accent-insensitive).
export function includesText(values, query) {
  const needle = normalize(query).trim();
  if (!needle) return true;
  return values.some((value) => normalize(value).includes(needle));
}
