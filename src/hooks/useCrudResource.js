import { useCallback } from 'react';
import { useResource } from './useResource';

const NO_RECORDS = [];

// A list from `api.getAll` plus create/update/remove that reload it afterwards.
// `api` must be a module-level object so its functions stay stable between renders.
export function useCrudResource(api) {
  const { data, status, error, reload } = useResource(api.getAll);

  const create = useCallback(
    async (request) => {
      const created = await api.create(request);
      await reload();
      return created;
    },
    [api, reload]
  );

  const update = useCallback(
    async (id, request) => {
      const updated = await api.update(id, request);
      await reload();
      return updated;
    },
    [api, reload]
  );

  const remove = useCallback(
    async (id) => {
      await api.remove(id);
      await reload();
    },
    [api, reload]
  );

  return { records: data ?? NO_RECORDS, status, error, reload, create, update, remove };
}
