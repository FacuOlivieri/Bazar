import { includesText } from './search';

export const EMPTY_CLIENT_DRAFT = { name: '', surname: '', dni: '', phone: '', email: '', address: '' };

export function clientFullName(client) {
  return `${client.name} ${client.surname}`;
}

export function dniDigits(text) {
  return String(text ?? '').replace(/\D/g, '');
}

// 30999888 → "30.999.888". Anything that is not a plain number is shown as it came.
export function formatDni(dni) {
  const text = String(dni ?? '');
  if (!/^[\d.]+$/.test(text)) return text;
  return dniDigits(text).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Digits only, keeping a leading "+" for international numbers: "+54 9 11…" → "+54911…".
export function phoneDigits(text) {
  const value = String(text ?? '').trim();
  return (value.startsWith('+') ? '+' : '') + dniDigits(value);
}

// Same rule as ClientService.validatePhone: digits, an optional leading "+" and separators.
export function hasInvalidPhoneChars(text) {
  return /[^\d\s\-().+]/.test(String(text ?? ''));
}

// 1155556666 → "11 5555-6666"; short numbers keep only the dash before the last four.
export function formatPhone(phone) {
  const normalized = phoneDigits(phone);
  const prefix = normalized.startsWith('+') ? '+' : '';
  const digits = normalized.slice(prefix.length);
  if (digits.length <= 4) return prefix + digits;
  if (digits.length < 8) return `${prefix}${digits.slice(0, -4)}-${digits.slice(-4)}`;
  return `${prefix}${digits.slice(0, -8)} ${digits.slice(-8, -4)}-${digits.slice(-4)}`.trim();
}

// A query made only of digits and dots is a DNI or a phone: match it ignoring the separators.
export function matchesClient(client, query) {
  if (/^[\d.\s-]+$/.test(query) && dniDigits(query)) {
    const digits = dniDigits(query);
    return dniDigits(client.dni).includes(digits) || phoneDigits(client.phone).includes(digits);
  }
  return includesText([client.name, client.surname, clientFullName(client), client.email], query);
}

// The backend field is spelled `adress`; the front calls it `address` and translates at the edges.
export function toClientDraft(client) {
  return {
    name: client.name ?? '',
    surname: client.surname ?? '',
    dni: dniDigits(client.dni),
    phone: phoneDigits(client.phone),
    email: client.email ?? '',
    address: client.adress ?? ''
  };
}

function optionalText(text) {
  const trimmed = String(text ?? '').trim();
  return trimmed || null;
}

// Body for POST /clients/create and PUT /clients/{id}. The phone travels as digits only.
export function toClientRequest(draft) {
  return {
    name: draft.name.trim(),
    surname: draft.surname.trim(),
    dni: dniDigits(draft.dni),
    phone: optionalText(phoneDigits(draft.phone)),
    email: optionalText(draft.email),
    adress: optionalText(draft.address)
  };
}

// Alphabetical by surname, then name, like a paper client book.
export function sortClients(clients) {
  return [...clients].sort(
    (a, b) => a.surname.localeCompare(b.surname, 'es') || a.name.localeCompare(b.name, 'es')
  );
}
