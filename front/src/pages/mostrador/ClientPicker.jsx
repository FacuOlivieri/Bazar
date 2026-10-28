import { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { clientFullName, formatDni, matchesClient } from '../../domain/client';

const MAX_OPTIONS = 6;

function ChosenClient({ client, onClear }) {
  return (
    <>
      <span className="field-label">Cliente</span>
      <div className="client-chosen">
        <span>
          <b>{clientFullName(client)}</b> <span className="num client-chosen__dni">· DNI {formatDni(client.dni)}</span>
        </span>
        <button type="button" className="link-btn" onClick={onClear}>
          Cambiar
        </button>
      </div>
    </>
  );
}

function ClientOptions({ options, onSelect }) {
  return (
    <ul id="clientes-lista" className="client-options" role="listbox" aria-label="Clientes">
      {options.map((client) => (
        <li key={client.idClientDTO} role="option" aria-selected="false">
          <button type="button" className="client-option" onClick={() => onSelect(client)}>
            {clientFullName(client)} <span className="num">DNI {formatDni(client.dni)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

// Type-ahead picker: the backend requires a client for every sale.
export function ClientPicker({ clients, selectedClient, onSelect, onClear, inputRef }) {
  const [query, setQuery] = useState('');

  if (selectedClient) {
    return <ChosenClient client={selectedClient} onClear={onClear} />;
  }

  const hasQuery = query.trim().length > 0;
  const options = hasQuery ? clients.filter((client) => matchesClient(client, query)).slice(0, MAX_OPTIONS) : [];

  function select(client) {
    setQuery('');
    onSelect(client);
  }

  return (
    <>
      <label htmlFor="cliente" className="field-label">
        Cliente
      </label>
      <div className="client-combo">
        <Icon name="user" size={18} />
        <input
          ref={inputRef}
          id="cliente"
          className="client-combo__input"
          type="text"
          role="combobox"
          aria-expanded={options.length > 0}
          aria-controls="clientes-lista"
          aria-autocomplete="list"
          autoComplete="off"
          placeholder="Nombre, apellido o DNI…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {options.length > 0 && <ClientOptions options={options} onSelect={select} />}
      {hasQuery && options.length === 0 && (
        <p className="helper-text client-combo__empty">Ningún cliente coincide con «{query}».</p>
      )}
    </>
  );
}
