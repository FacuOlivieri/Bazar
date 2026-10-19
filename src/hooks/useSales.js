import { salesApi } from '../api/salesApi';
import { useResource } from './useResource';

const NO_SALES = [];

// Every sale ever made (GET /sales); the Ventas screen filters them on the client.
export function useSales() {
  const { data, status, error, reload } = useResource(salesApi.getAll);
  return { sales: data ?? NO_SALES, status, error, reload };
}
