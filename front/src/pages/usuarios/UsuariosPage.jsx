import { useMemo, useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { InlineError, Notice } from '../../components/ui/Feedback';
import { Icon } from '../../components/ui/Icon';
import { PanelHeader } from '../../components/ui/PanelHeader';
import { SearchField } from '../../components/ui/SearchField';
import { Tabs } from '../../components/ui/Tabs';
import { describeLoadError } from '../../domain/adminErrors';
import { formatNumber, pluralize } from '../../domain/format';
import { sortRoles } from '../../domain/role';
import { isActiveUser, matchesUser, sortUsers } from '../../domain/user';
import { useAuth } from '../../hooks/useAuth';
import { PANEL_MODE, useEditPanel } from '../../hooks/useEditPanel';
import { useRoles } from '../../hooks/useRoles';
import { useUsers } from '../../hooks/useUsers';
import { UserForm } from './UserForm';
import { UsersTable } from './UsersTable';

const TABS = [
  { key: 'all', label: 'Todos', filter: () => true },
  { key: 'active', label: 'Activos', filter: isActiveUser },
  { key: 'inactive', label: 'Inactivos', filter: (user) => !isActiveUser(user) }
];

const getUserId = (user) => user.idUser;

const PANEL_MESSAGES = {
  created: (request) => `Se creó el usuario ${request.username}. Ya puede entrar con su contraseña.`,
  updated: (request) => `Se guardaron los cambios de ${request.username}.`,
  removed: (user) => `Se eliminó el usuario ${user.username}.`
};

function emptyCopyFor(tabKey, query) {
  if (query.trim()) return { title: `Ningún usuario coincide con «${query}»`, hint: 'Se busca por nombre de usuario o por rol.' };
  if (tabKey === 'inactive') return { title: 'No hay usuarios inactivos', hint: 'Acá aparecen los deshabilitados, bloqueados o vencidos.' };
  if (tabKey === 'active') return { title: 'No hay usuarios activos', hint: 'Revisá la pestaña «Inactivos».' };
  return { title: 'Todavía no hay usuarios', hint: 'Creá el primero con «Nuevo usuario».' };
}

function panelHeaderFor(panel) {
  if (panel.mode === PANEL_MODE.CREATE) return { title: 'Nuevo usuario', subtitle: 'Nombre, contraseña y roles' };
  if (panel.mode === PANEL_MODE.EDIT) return { title: `Usuario N.º ${formatNumber(panel.editing.idUser)}`, subtitle: `Editando a ${panel.editing.username}` };
  return { title: 'Usuarios', subtitle: 'Quién entra al sistema y qué puede hacer' };
}

function IdlePanel({ activeCount, onCreate }) {
  return (
    <div className="side-column__body panel-idle">
      <p className="helper-text">Cada persona del local entra con su usuario y contraseña. Lo que puede hacer depende de los roles que tenga.</p>
      <p className="num panel-idle__count">{pluralize(activeCount, 'usuario activo', 'usuarios activos')}</p>
      <button type="button" className="btn btn--ghost" onClick={onCreate}>
        <Icon name="plus" size={14} strokeWidth={2.6} />
        Nuevo usuario
      </button>
    </div>
  );
}

export function UsuariosPage() {
  const { session } = useAuth();
  const book = useUsers();
  const { roles } = useRoles();
  const panel = useEditPanel({
    create: book.create,
    update: book.update,
    remove: book.remove,
    getId: getUserId,
    messages: PANEL_MESSAGES
  });
  const [tabKey, setTabKey] = useState('all');
  const [query, setQuery] = useState('');

  const roleNames = useMemo(() => sortRoles(roles).map((role) => role.role), [roles]);
  const activeTab = TABS.find((tab) => tab.key === tabKey);
  const visibleUsers = sortUsers(book.users.filter((user) => activeTab.filter(user) && matchesUser(user, query)));
  const counts = Object.fromEntries(TABS.map((tab) => [tab.key, book.users.filter(tab.filter).length]));
  const header = panelHeaderFor(panel);

  return (
    <AppShell
      railFooter={
        <>
          <p className="rail__footer-title">Usuarios</p>
          <p className="num">{pluralize(counts.active, 'activo', 'activos')}</p>
        </>
      }
    >
      <main className="work">
        <div className="work__header">
          <h1 className="screen-title">Usuarios</h1>
          <button type="button" className="btn btn--primary" onClick={panel.startCreate}>
            <Icon name="plus" size={14} strokeWidth={2.6} />
            Nuevo usuario
          </button>
        </div>

        <div className="tabs-row">
          <Tabs label="Vista de usuarios" tabs={TABS} activeKey={tabKey} counts={counts} onSelect={setTabKey} />
          <SearchField id="filtrar-usuarios" variant="inline" label="Filtrar por usuario o rol" placeholder="Filtrar por usuario o rol…" value={query} onChange={setQuery} />
        </div>

        {panel.notice && <Notice>{panel.notice}</Notice>}
        {panel.listError && <InlineError>{panel.listError}</InlineError>}

        <UsersTable
          users={visibleUsers}
          currentUsername={session.username}
          status={book.status}
          errorMessage={describeLoadError(book.error, '/api/v1/users')}
          onRetry={book.reload}
          selectedId={panel.editing?.idUser}
          onEdit={panel.startEdit}
          onDelete={panel.remove}
          isBusy={panel.isBusy}
          emptyCopy={emptyCopyFor(tabKey, query)}
        />
      </main>

      <aside className="side-column" aria-label={header.title}>
        <PanelHeader title={header.title} subtitle={header.subtitle} />
        {panel.mode === PANEL_MODE.IDLE ? (
          <IdlePanel activeCount={counts.active} onCreate={panel.startCreate} />
        ) : (
          <UserForm
            key={panel.editing?.idUser ?? 'new'}
            user={panel.editing}
            isSelf={panel.editing?.username === session.username}
            roleNames={roleNames}
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
