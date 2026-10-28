import { rolesApi } from '../api/rolesApi';
import { useCrudResource } from './useCrudResource';

// Roles with the names of their permissions.
export function useRoles() {
  const { records, ...rest } = useCrudResource(rolesApi);
  return { roles: records, ...rest };
}
