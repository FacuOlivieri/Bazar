import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { InlineError, Notice } from '../../components/ui/Feedback';
import { Icon } from '../../components/ui/Icon';
import { PanelHeader } from '../../components/ui/PanelHeader';
import { SearchField } from '../../components/ui/SearchField';
import { describeLoadError } from '../../domain/adminErrors';
import { formatNumber, pluralize } from '../../domain/format';
import { countRolesWithPermission, matchesPermission, sortPermissions } from '../../domain/permission';
import { PANEL_MODE, useEditPanel } from '../../hooks/useEditPanel';
import { usePermissions } from '../../hooks/usePermissions';
import { useRoles } from '../../hooks/useRoles';
import { PermissionForm } from './PermissionForm';
import { PermissionsTable } from './PermissionsTable';

const getPermissionId = (permission) => permission.idPermission;

const PANEL_MESSAGES = {
  created: (request) => `Se creó el permiso ${request.permissionName}.`,
  updated: (request) => `Se guardaron los cambios del permiso ${request.permissionName}.`,
  removed: (permission) => `Se eliminó el permiso ${permission.permissionName}.`
};

function emptyCopyFor(query) {
  if (query.trim()) return { title: `Ningún permiso coincide con «${query}»`, hint: 'Probá con una parte del nombre.' };
  return { title: 'Todavía no hay permisos', hint: 'Creá el primero con «Nuevo permiso».' };
}

function panelHeaderFor(panel) {
  if (panel.mode === PANEL_MODE.CREATE) return { title: 'Nuevo permiso', subtitle: 'Después se agrega a uno o más roles' };
  if (panel.mode === PANEL_MODE.EDIT) return { title: `Permiso N.º ${formatNumber(panel.editing.idPermission)}`, subtitle: 'Editando el nombre' };
  return { title: 'Permisos', subtitle: 'Lo que cada rol puede hacer' };
}

function IdlePanel({ count, onCreate }) {
  return (
    <div className="side-column__body panel-idle">
      <p className="helper-text">
        Un permiso es una acción que el sistema autoriza, como VER_VENTAS o EDITAR_PRODUCTOS. Los permisos se juntan en <Link to="/roles">roles</Link>, y los roles se le dan a cada usuario. Por ahora las pantallas se abren por rol (ADMIN o EMPLEADO), no por permiso.
      </p>
      <p className="num panel-idle__count">{pluralize(count, 'permiso', 'permisos')}</p>
      <button type="button" className="btn btn--ghost" onClick={onCreate}>
        <Icon name="plus" size={14} strokeWidth={2.6} />
        Nuevo permiso
      </button>
    </div>
  );
}

export function PermisosPage() {
  const book = usePermissions();
  const { roles, reload: reloadRoles } = useRoles();

  // A renamed permission is renamed inside its roles too: refresh them for the «Usado en» column.
  const updatePermission = useCallback(
    async (idPermission, request) => {
      await book.update(idPermission, request);
      await reloadRoles();
    },
    [book.update, reloadRoles]
  );

  const panel = useEditPanel({
    create: book.create,
    update: updatePermission,
    remove: book.remove,
    getId: getPermissionId,
    messages: PANEL_MESSAGES
  });
  const [query, setQuery] = useState('');

  const roleCounts = useMemo(
    () => Object.fromEntries(book.permissions.map((permission) => [permission.permissionName, countRolesWithPermission(permission.permissionName, roles)])),
    [book.permissions, roles]
  );
  const visiblePermissions = sortPermissions(book.permissions.filter((permission) => matchesPermission(permission, query)));
  const header = panelHeaderFor(panel);

  return (
    <AppShell
      railFooter={
        <>
          <p className="rail__footer-title">Permisos</p>
          <p className="num">{pluralize(book.permissions.length, 'cargado', 'cargados')}</p>
        </>
      }
    >
      <main className="work">
        <div className="work__header">
          <h1 className="screen-title">Permisos</h1>
          <button type="button" className="btn btn--primary" onClick={panel.startCreate}>
            <Icon name="plus" size={14} strokeWidth={2.6} />
            Nuevo permiso
          </button>
        </div>

        <div className="tabs-row">
          <SearchField id="filtrar-permisos" variant="inline" label="Filtrar por nombre" placeholder="Filtrar por nombre…" value={query} onChange={setQuery} />
        </div>

        {panel.notice && <Notice>{panel.notice}</Notice>}
        {panel.listError && <InlineError>{panel.listError}</InlineError>}

        <PermissionsTable
          permissions={visiblePermissions}
          roleCounts={roleCounts}
          status={book.status}
          errorMessage={describeLoadError(book.error, '/api/v1/permissions')}
          onRetry={book.reload}
          selectedId={panel.editing?.idPermission}
          onEdit={panel.startEdit}
          onDelete={panel.remove}
          isBusy={panel.isBusy}
          emptyCopy={emptyCopyFor(query)}
        />
      </main>

      <aside className="side-column" aria-label={header.title}>
        <PanelHeader title={header.title} subtitle={header.subtitle} />
        {panel.mode === PANEL_MODE.IDLE ? (
          <IdlePanel count={book.permissions.length} onCreate={panel.startCreate} />
        ) : (
          <PermissionForm
            key={panel.editing?.idPermission ?? 'new'}
            permission={panel.editing}
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
