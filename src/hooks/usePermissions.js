import { permissionsApi } from '../api/permissionsApi';
import { useCrudResource } from './useCrudResource';

export function usePermissions() {
  const { records, ...rest } = useCrudResource(permissionsApi);
  return { permissions: records, ...rest };
}
