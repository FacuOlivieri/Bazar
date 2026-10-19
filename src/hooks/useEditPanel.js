import { useCallback, useState } from 'react';

export const PANEL_MODE = { IDLE: 'idle', CREATE: 'create', EDIT: 'edit' };

// Side panel state for a CRUD screen: which record is open, saving status and the last message.
// `messages` builds the success copy: created(request), updated(request), removed(record).
// `describeError` can turn an API error into copy for the shop (defaults to its message).
export function useEditPanel({ create, update, remove, getId, messages, describeError = (error) => error.message }) {
  const [mode, setMode] = useState(PANEL_MODE.IDLE);
  const [editing, setEditing] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  // Deleting happens from the table, so its error is shown there instead of in the form.
  const [listError, setListError] = useState(null);

  const open = useCallback((nextMode, record = null) => {
    setMode(nextMode);
    setEditing(record);
    setError(null);
    setNotice(null);
    setListError(null);
  }, []);

  const startCreate = useCallback(() => open(PANEL_MODE.CREATE), [open]);
  const startEdit = useCallback((record) => open(PANEL_MODE.EDIT, record), [open]);
  const close = useCallback(() => open(PANEL_MODE.IDLE), [open]);

  const run = useCallback(
    async (action, successMessage, kind) => {
      setIsBusy(true);
      setError(null);
      try {
        await action();
        open(PANEL_MODE.IDLE);
        setNotice(successMessage);
      } catch (actionError) {
        setError(describeError(actionError, kind));
      } finally {
        setIsBusy(false);
      }
    },
    [open, describeError]
  );

  const save = useCallback(
    (request) =>
      mode === PANEL_MODE.CREATE
        ? run(() => create(request), messages.created(request), 'create')
        : run(() => update(getId(editing), request), messages.updated(request), 'update'),
    [mode, editing, run, create, update, getId, messages]
  );

  const removeRecord = useCallback(
    async (record) => {
      setIsBusy(true);
      setNotice(null);
      setListError(null);
      try {
        await remove(getId(record));
        if (editing && getId(editing) === getId(record)) open(PANEL_MODE.IDLE);
        setNotice(messages.removed(record));
      } catch (removeError) {
        setListError(describeError(removeError, 'remove'));
      } finally {
        setIsBusy(false);
      }
    },
    [editing, open, remove, getId, messages, describeError]
  );

  return { mode, editing, isBusy, error, notice, listError, startCreate, startEdit, close, save, remove: removeRecord };
}
