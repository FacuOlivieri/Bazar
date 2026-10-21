import { EmptyState, ErrorState, SkeletonRows } from '../../components/ui/Feedback';
import { RowActions } from '../../components/ui/RecordForm';
import { formatNumber, pluralize } from '../../domain/format';
import { LOAD_STATUS } from '../../hooks/useResource';

const COLUMN_COUNT = 4;

function PermissionRow({ permission, roleCount, isSelected, onEdit, onDelete, isBusy }) {
  return (
    <tr className={isSelected ? 'is-selected' : undefined}>
      <td className="col-number product-number">{formatNumber(permission.idPermission)}</td>
      <td>
        <span className="name-code">{permission.permissionName}</span>
      </td>
      <td className="col-count">{roleCount === 0 ? <span className="name-tags__empty">Ningún rol</span> : pluralize(roleCount, 'rol', 'roles')}</td>
      <td className="col-action">
        <RowActions
          recordName={`el permiso ${permission.permissionName}`}
          onEdit={() => onEdit(permission)}
          onDelete={() => onDelete(permission)}
          isBusy={isBusy}
          deleteBlockedReason={roleCount > 0 ? `Está en ${pluralize(roleCount, 'rol', 'roles')}. Sacalo de ahí antes de eliminarlo.` : null}
        />
      </td>
    </tr>
  );
}

export function PermissionsTable({ permissions, roleCounts, status, errorMessage, onRetry, selectedId, onEdit, onDelete, isBusy, emptyCopy }) {
  if (status === LOAD_STATUS.ERROR && permissions.length === 0) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  const isLoading = status === LOAD_STATUS.LOADING;

  return (
    <div className="table-box">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col" className="col-number">N.º</th>
            <th scope="col">Permiso</th>
            <th scope="col" className="col-count">Usado en</th>
            <th scope="col"><span className="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && <SkeletonRows columns={COLUMN_COUNT} />}
          {permissions.map((permission) => (
            <PermissionRow
              key={permission.idPermission}
              permission={permission}
              roleCount={roleCounts[permission.permissionName] ?? 0}
              isSelected={permission.idPermission === selectedId}
              onEdit={onEdit}
              onDelete={onDelete}
              isBusy={isBusy}
            />
          ))}
        </tbody>
      </table>
      {!isLoading && permissions.length === 0 && <EmptyState title={emptyCopy.title} hint={emptyCopy.hint} />}
    </div>
  );
}
