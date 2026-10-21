import { EmptyState, ErrorState, SkeletonRows } from '../../components/ui/Feedback';
import { NameTags } from '../../components/ui/NameTags';
import { RowActions } from '../../components/ui/RecordForm';
import { formatNumber } from '../../domain/format';
import { userStatus } from '../../domain/user';
import { LOAD_STATUS } from '../../hooks/useResource';

const COLUMN_COUNT = 5;

function UserStatus({ user }) {
  const status = userStatus(user);
  return <span className={status.key === 'active' ? 'status-mark is-active' : 'status-mark'}>{status.label}</span>;
}

function UserRow({ user, isSelf, isSelected, onEdit, onDelete, isBusy }) {
  return (
    <tr className={isSelected ? 'is-selected' : undefined}>
      <td className="col-number product-number">{formatNumber(user.idUser)}</td>
      <td className="col-name">
        {user.username}
        {isSelf && <span className="you-mark">Vos</span>}
      </td>
      <td>
        <NameTags names={user.roles} emptyLabel="Sin roles" />
      </td>
      <td>
        <UserStatus user={user} />
      </td>
      <td className="col-action">
        <RowActions
          recordName={`el usuario ${user.username}`}
          onEdit={() => onEdit(user)}
          onDelete={() => onDelete(user)}
          isBusy={isBusy}
          deleteBlockedReason={isSelf ? 'Es tu usuario: no podés eliminarlo mientras estás adentro.' : null}
        />
      </td>
    </tr>
  );
}

export function UsersTable({ users, currentUsername, status, errorMessage, onRetry, selectedId, onEdit, onDelete, isBusy, emptyCopy }) {
  if (status === LOAD_STATUS.ERROR && users.length === 0) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  const isLoading = status === LOAD_STATUS.LOADING;

  return (
    <div className="table-box">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col" className="col-number">N.º</th>
            <th scope="col">Usuario</th>
            <th scope="col">Roles</th>
            <th scope="col">Estado</th>
            <th scope="col"><span className="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && <SkeletonRows columns={COLUMN_COUNT} />}
          {users.map((user) => (
            <UserRow
              key={user.idUser}
              user={user}
              isSelf={user.username === currentUsername}
              isSelected={user.idUser === selectedId}
              onEdit={onEdit}
              onDelete={onDelete}
              isBusy={isBusy}
            />
          ))}
        </tbody>
      </table>
      {!isLoading && users.length === 0 && <EmptyState title={emptyCopy.title} hint={emptyCopy.hint} />}
    </div>
  );
}
