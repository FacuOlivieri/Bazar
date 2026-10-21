import { useCallback, useMemo, useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { InlineError, Notice } from '../../components/ui/Feedback';
import { Icon } from '../../components/ui/Icon';
import { PanelHeader } from '../../components/ui/PanelHeader';
import { SearchField } from '../../components/ui/SearchField';
import { describeLoadError } from '../../domain/adminErrors';
import { formatNumber, pluralize } from '../../domain/format';
import { sortPermissions } from '../../domain/permission';
import { countUsersWithRole, matchesRole, sortRoles } from '../../domain/role';
import { PANEL_MODE, useEditPanel } from '../../hooks/useEditPanel';
import { usePermissions } from '../../hooks/usePermissions';
import { useRoles } from '../../hooks/useRoles';
import { useUsers } from '../../hooks/useUsers';
import { RoleForm } from './RoleForm';
import { RolesTable } from './RolesTable';

const getRoleId = (role) => role.idRole;

const PANEL_MESSAGES = {
  created: (request) => `Se creó el rol ${request.role} con ${pluralize(request.permissions.length, 'permiso', 'permisos')}.`,
  updated: (request) => `Se guardaron los cambios del rol ${request.role}.`,
  removed: (role) => `Se eliminó el rol ${role.role}.`
};

function emptyCopyFor(query) {
  if (query.trim()) return { title: `Ningún rol coincide con «${query}»`, hint: 'Se busca por el nombre del rol o de sus permisos.' };
  return { title: 'Todavía no hay roles', hint: 'Creá el primero con «Nuevo rol».' };
}

function panelHeaderFor(panel) {
  if (panel.mode === PANEL_MODE.CREATE) return { title: 'Nuevo rol', subtitle: 'Un nombre y sus permisos' };
  if (panel.mode === PANEL_MODE.EDIT) return { title: `Rol N.º ${formatNumber(panel.editing.idRole)}`, subtitle: 'Editando nombre y permisos' };
  return { title: 'Roles', subtitle: 'Grupos de permisos para cada usuario' };
}

function IdlePanel({ count, onCreate }) {
  return (
    <div className="side-column__body panel-idle">
      <p className="helper-text">Un rol junta permisos con un nombre. A cada usuario se le dan uno o más roles y puede hacer lo que permiten todos juntos.</p>
      <p className="helper-text">
        ADMIN maneja todo: precios, stock, la caja del día, borrar clientes y esta sección. EMPLEADO vende, carga clientes y ve los productos.
      </p>
      <p className="num panel-idle__count">{pluralize(count, 'rol', 'roles')}</p>
      <button type="button" className="btn btn--ghost" onClick={onCreate}>
        <Icon name="plus" size={14} strokeWidth={2.6} />
        Nuevo rol
      </button>
    </div>
  );
}

export function RolesPage() {
  const book = useRoles();
  const { permissions } = usePermissions();
  const { users, reload: reloadUsers } = useUsers();

  // A renamed role is renamed inside its users too: refresh them for the «Usuarios» column.
  const updateRole = useCallback(
    async (idRole, request) => {
      await book.update(idRole, request);
      await reloadUsers();
    },
    [book.update, reloadUsers]
  );

  const panel = useEditPanel({
    create: book.create,
    update: updateRole,
    remove: book.remove,
    getId: getRoleId,
    messages: PANEL_MESSAGES
  });
  const [query, setQuery] = useState('');

  const permissionNames = useMemo(() => sortPermissions(permissions).map((permission) => permission.permissionName), [permissions]);
  const userCounts = useMemo(() => Object.fromEntries(book.roles.map((role) => [role.role, countUsersWithRole(role.role, users)])), [book.roles, users]);
  const visibleRoles = sortRoles(book.roles.filter((role) => matchesRole(role, query)));
  const header = panelHeaderFor(panel);

  return (
    <AppShell
      railFooter={
        <>
          <p className="rail__footer-title">Roles</p>
          <p className="num">{pluralize(book.roles.length, 'cargado', 'cargados')}</p>
        </>
      }
    >
      <main className="work">
        <div className="work__header">
          <h1 className="screen-title">Roles</h1>
          <button type="button" className="btn btn--primary" onClick={panel.startCreate}>
            <Icon name="plus" size={14} strokeWidth={2.6} />
            Nuevo rol
          </button>
        </div>

        <div className="tabs-row">
          <SearchField id="filtrar-roles" variant="inline" label="Filtrar por rol o permiso" placeholder="Filtrar por rol o permiso…" value={query} onChange={setQuery} />
        </div>

        {panel.notice && <Notice>{panel.notice}</Notice>}
        {panel.listError && <InlineError>{panel.listError}</InlineError>}

        <RolesTable
          roles={visibleRoles}
          userCounts={userCounts}
          status={book.status}
          errorMessage={describeLoadError(book.error, '/api/v1/roles')}
          onRetry={book.reload}
          selectedId={panel.editing?.idRole}
          onEdit={panel.startEdit}
          onDelete={panel.remove}
          isBusy={panel.isBusy}
          emptyCopy={emptyCopyFor(query)}
        />
      </main>

      <aside className="side-column" aria-label={header.title}>
        <PanelHeader title={header.title} subtitle={header.subtitle} />
        {panel.mode === PANEL_MODE.IDLE ? (
          <IdlePanel count={book.roles.length} onCreate={panel.startCreate} />
        ) : (
          <RoleForm
            key={panel.editing?.idRole ?? 'new'}
            role={panel.editing}
            permissionNames={permissionNames}
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
