import { usersApi } from '../api/usersApi';
import { useCrudResource } from './useCrudResource';

// Users of the system (without passwords: UserDTO never sends them back).
export function useUsers() {
  const { records, ...rest } = useCrudResource(usersApi);
  return { users: records, ...rest };
}
