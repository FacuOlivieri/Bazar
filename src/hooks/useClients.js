import { useCallback, useMemo } from 'react';
import { clientsApi } from '../api/clientsApi';
import { useResource } from './useResource';

const NO_CLIENTS = [];

export function useClients() {
  const { data, status, error, reload } = useResource(clientsApi.getAll);
  const clients = data ?? NO_CLIENTS;
  const clientsById = useMemo(() => new Map(clients.map((c) => [c.idClientDTO, c])), [clients]);

  const createClient = useCallback(
    async (request) => {
      const created = await clientsApi.create(request);
      await reload();
      return created;
    },
    [reload]
  );

  const updateClient = useCallback(
    async (idClient, request) => {
      const updated = await clientsApi.update(idClient, request);
      await reload();
      return updated;
    },
    [reload]
  );

  const deleteClient = useCallback(
    async (idClient) => {
      await clientsApi.remove(idClient);
      await reload();
    },
    [reload]
  );

  return { clients, clientsById, status, error, reload, createClient, updateClient, deleteClient };
}
