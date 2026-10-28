import { http } from './httpClient';

// PermissionController: /api/v1/permissions (same routes as CouponController; see TODO.md · Seguridad)
export const permissionsApi = {
  getAll: () => http.get('/permissions'),
  create: (permission) => http.post('/permissions/create', permission),
  update: (idPermission, permission) => http.put(`/permissions/${idPermission}`, permission),
  remove: (idPermission) => http.delete(`/permissions/${idPermission}`)
};
