import { EmptyState, ErrorState, SkeletonRows } from '../../components/ui/Feedback';
import { RowActions } from '../../components/ui/RecordForm';
import { clientFullName, formatDni, formatPhone } from '../../domain/client';
import { formatNumber } from '../../domain/format';
import { LOAD_STATUS } from '../../hooks/useResource';

const COLUMN_COUNT = 7;
const MISSING = '—';

function ClientRow({ client, isSelected, onEdit, onDelete, isBusy }) {
  return (
    <tr className={isSelected ? 'is-selected' : undefined}>
      <td className="col-number product-number">{formatNumber(client.idClientDTO)}</td>
      <td className="col-name">
        <span className="client-surname">{client.surname}</span>, {client.name}
      </td>
      <td className="col-dni num">{formatDni(client.dni) || MISSING}</td>
      <td className="col-phone num">{client.phone ? formatPhone(client.phone) : MISSING}</td>
      <td className="col-email">{client.email || MISSING}</td>
      <td className="col-address">{client.adress || MISSING}</td>
      <td className="col-action">
        <RowActions recordName={clientFullName(client)} onEdit={() => onEdit(client)} onDelete={() => onDelete(client)} isBusy={isBusy} />
      </td>
    </tr>
  );
}

export function ClientsTable({ clients, status, error, onRetry, selectedId, onEdit, onDelete, isBusy, emptyCopy }) {
  if (status === LOAD_STATUS.ERROR && clients.length === 0) {
    return <ErrorState message={error?.message} onRetry={onRetry} />;
  }

  const isLoading = status === LOAD_STATUS.LOADING;

  return (
    <div className="table-box">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col" className="col-number">N.º</th>
            <th scope="col">Apellido y nombre</th>
            <th scope="col" className="col-dni">DNI</th>
            <th scope="col" className="col-phone">Teléfono</th>
            <th scope="col" className="col-email">Email</th>
            <th scope="col" className="col-address">Dirección</th>
            <th scope="col"><span className="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && <SkeletonRows columns={COLUMN_COUNT} />}
          {clients.map((client) => (
            <ClientRow
              key={client.idClientDTO}
              client={client}
              isSelected={client.idClientDTO === selectedId}
              onEdit={onEdit}
              onDelete={onDelete}
              isBusy={isBusy}
            />
          ))}
        </tbody>
      </table>
      {!isLoading && clients.length === 0 && <EmptyState title={emptyCopy.title} hint={emptyCopy.hint} />}
    </div>
  );
}
