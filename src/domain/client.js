import { includesText } from './search';

export const EMPTY_CLIENT_DRAFT = { name: '', surname: '', dni: '' };

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

// A query made only of digits and dots is a DNI: match it ignoring the dots.
export function matchesClient(client, query) {
  if (/^[\d.\s]+$/.test(query) && dniDigits(query)) {
    return dniDigits(client.dni).includes(dniDigits(query));
  }
  return includesText([client.name, client.surname, clientFullName(client)], query);
}

export function toClientDraft(client) {
  return { name: client.name ?? '', surname: client.surname ?? '', dni: dniDigits(client.dni) };
}

// Body for POST /clients/create and PUT /clients/{id}.
export function toClientRequest(draft) {
  return { name: draft.name.trim(), surname: draft.surname.trim(), dni: dniDigits(draft.dni) };
}

// Alphabetical by surname, then name, like a paper client book.
export function sortClients(clients) {
  return [...clients].sort(
    (a, b) => a.surname.localeCompare(b.surname, 'es') || a.name.localeCompare(b.name, 'es')
  );
}
