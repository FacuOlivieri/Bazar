// 'always' groups four-digit figures too (1.500), which some locales skip by default.
const priceFormatter = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2, useGrouping: 'always' });
const quantityFormatter = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0, useGrouping: 'always' });

export function formatPrice(amount) {
  return '$ ' + priceFormatter.format(Number(amount) || 0);
}

// Counts and stock with thousands dots: 1500 → "1.500".
export function formatQuantity(amount) {
  return quantityFormatter.format(Number(amount) || 0);
}

// Pads a backend id to four digits: 12 → "0012".
export function formatNumber(id) {
  return String(id).padStart(4, '0');
}

// Local calendar date as YYYY-MM-DD (the backend expects LocalDate).
export function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function formatToday() {
  return new Date().toLocaleDateString('es-AR');
}

export function pluralize(count, singular, plural) {
  return `${formatQuantity(count)} ${count === 1 ? singular : plural}`;
}
