import { EmptyState, ErrorState, SkeletonRows } from '../../components/ui/Feedback';
import { NameTags } from '../../components/ui/NameTags';
import { RowActions } from '../../components/ui/RecordForm';
import { formatNumber, pluralize } from '../../domain/format';
import { LOAD_STATUS } from '../../hooks/useResource';

const COLUMN_COUNT = 5;

function RoleRow({ role, userCount, isSelected, onEdit, onDelete, isBusy }) {
  return (
    <tr className={isSelected ? 'is-selected' : undefined}>
      <td className="col-number product-number">{formatNumber(role.idRole)}</td>
      <td>
        <span className="name-code">{role.role}</span>
      </td>
      <td>
        <NameTags names={role.permissions} emptyLabel="Sin permisos" />
      </td>
      <td className="col-count">{userCount === 0 ? <span className="name-tags__empty">Nadie</span> : pluralize(userCount, 'usuario', 'usuarios')}</td>
      <td className="col-action">
        <RowActions
          recordName={`el rol ${role.role}`}
          onEdit={() => onEdit(role)}
          onDelete={() => onDelete(role)}
          isBusy={isBusy}
          deleteBlockedReason={userCount > 0 ? `Lo tiene${userCount === 1 ? '' : 'n'} ${pluralize(userCount, 'usuario', 'usuarios')}. Sacáselo antes de eliminarlo.` : null}
        />
      </td>
    </tr>
  );
}

export function RolesTable({ roles, userCounts, status, errorMessage, onRetry, selectedId, onEdit, onDelete, isBusy, emptyCopy }) {
  if (status === LOAD_STATUS.ERROR && roles.length === 0) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  const isLoading = status === LOAD_STATUS.LOADING;

  return (
    <div className="table-box">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col" className="col-number">N.º</th>
            <th scope="col">Rol</th>
            <th scope="col">Permisos</th>
            <th scope="col" className="col-count">Usuarios</th>
            <th scope="col"><span className="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && <SkeletonRows columns={COLUMN_COUNT} />}
          {roles.map((role) => (
            <RoleRow
              key={role.idRole}
              role={role}
              userCount={userCounts[role.role] ?? 0}
              isSelected={role.idRole === selectedId}
              onEdit={onEdit}
              onDelete={onDelete}
              isBusy={isBusy}
            />
          ))}
        </tbody>
      </table>
      {!isLoading && roles.length === 0 && <EmptyState title={emptyCopy.title} hint={emptyCopy.hint} />}
    </div>
  );
}
