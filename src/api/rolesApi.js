import { http } from './httpClient';

// RoleController: /api/v1/roles (same routes as CouponController; see TODO.md · Seguridad)
export const rolesApi = {
  getAll: () => http.get('/roles'),
  create: (role) => http.post('/roles/create', role),
  update: (idRole, role) => http.put(`/roles/${idRole}`, role),
  remove: (idRole) => http.delete(`/roles/${idRole}`)
};
