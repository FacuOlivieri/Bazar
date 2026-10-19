import { useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { InlineError, Notice } from '../../components/ui/Feedback';
import { Icon } from '../../components/ui/Icon';
import { PanelHeader } from '../../components/ui/PanelHeader';
import { SearchField } from '../../components/ui/SearchField';
import { clientFullName, matchesClient, sortClients } from '../../domain/client';
import { formatNumber, pluralize } from '../../domain/format';
import { useClients } from '../../hooks/useClients';
import { PANEL_MODE, useEditPanel } from '../../hooks/useEditPanel';
import { ClientForm } from './ClientForm';
import { ClientsTable } from './ClientsTable';
import './clientes.css';

const getClientId = (client) => client.idClientDTO;

const PANEL_MESSAGES = {
  created: (request) => `«${clientFullName(request)}» se agregó a los clientes.`,
  updated: (request) => `Se guardaron los cambios de «${clientFullName(request)}».`,
  removed: (client) => `«${clientFullName(client)}» se eliminó de los clientes.`
};

// The back answers 500 when the client still has sales pointing at it (foreign key).
function describeClientError(error, kind) {
  if (kind === 'remove' && error.status >= 500) {
    return 'No se pudo eliminar. Si este cliente tiene ventas registradas, el sistema no deja borrarlo.';
  }
  return error.message;
}

function emptyCopyFor(query) {
  if (query.trim()) return { title: `Nada coincide con «${query}»`, hint: 'Probá con el apellido, el DNI, el teléfono o el email.' };
  return { title: 'Todavía no hay clientes', hint: 'Cargá el primero con «Nuevo cliente».' };
}

function panelHeaderFor(panel) {
  if (panel.mode === PANEL_MODE.CREATE) return { title: 'Nuevo cliente', subtitle: 'Queda disponible para elegir en el mostrador' };
  if (panel.mode === PANEL_MODE.EDIT) return { title: `Cliente N.º ${formatNumber(panel.editing.idClientDTO)}`, subtitle: 'Editando datos del cliente' };
  return { title: 'Ficha de cliente', subtitle: 'Elegí uno de la lista o cargá uno nuevo' };
}

function IdlePanel({ onCreate }) {
  return (
    <div className="side-column__body clients-idle">
      <p className="helper-text">
        Tocá «Editar» en la lista para cambiar los datos de un cliente: nombre, DNI, teléfono, email o dirección. «Eliminar» está al lado y pide confirmación.
      </p>
      <button type="button" className="btn btn--ghost" onClick={onCreate}>
        <Icon name="plus" size={14} strokeWidth={2.6} />
        Nuevo cliente
      </button>
    </div>
  );
}

export function ClientesPage() {
  const book = useClients();
  const panel = useEditPanel({
    create: book.createClient,
    update: book.updateClient,
    remove: book.deleteClient,
    getId: getClientId,
    messages: PANEL_MESSAGES,
    describeError: describeClientError
  });
  const [query, setQuery] = useState('');

  const visibleClients = sortClients(book.clients.filter((client) => matchesClient(client, query)));
  const header = panelHeaderFor(panel);

  return (
    <AppShell
      railFooter={
        <>
          <p className="rail__footer-title">Clientes</p>
          <p className="num">{pluralize(book.clients.length, 'cliente cargado', 'clientes cargados')}</p>
        </>
      }
    >
      <main className="work">
        <div className="work__header">
          <h1 className="screen-title">Clientes</h1>
          <button type="button" className="btn btn--primary" onClick={panel.startCreate}>
            <Icon name="plus" size={14} strokeWidth={2.6} />
            Nuevo cliente
          </button>
        </div>

        <div className="clients-filter">
          <SearchField
            id="filtrar-clientes"
            variant="inline"
            label="Filtrar por nombre, DNI, teléfono o email"
            placeholder="Nombre, DNI, teléfono o email…"
            value={query}
            onChange={setQuery}
          />
        </div>

        {panel.notice && <Notice>{panel.notice}</Notice>}
        {panel.listError && <InlineError>{panel.listError}</InlineError>}

        <ClientsTable
          clients={visibleClients}
          status={book.status}
          error={book.error}
          onRetry={book.reload}
          selectedId={panel.editing?.idClientDTO}
          onEdit={panel.startEdit}
          onDelete={panel.remove}
          isBusy={panel.isBusy}
          emptyCopy={emptyCopyFor(query)}
        />
      </main>

      <aside className="side-column" aria-label={header.title}>
        <PanelHeader title={header.title} subtitle={header.subtitle} />
        {panel.mode === PANEL_MODE.IDLE ? (
          <IdlePanel onCreate={panel.startCreate} />
        ) : (
          <ClientForm
            key={panel.editing?.idClientDTO ?? 'new'}
            client={panel.editing}
            onSave={panel.save}
            onCancel={panel.close}
            isBusy={panel.isBusy}
            error={panel.error}
          />
        )}
      </aside>
    </AppShell>
  );
}
