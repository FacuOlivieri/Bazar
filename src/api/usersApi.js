import { http } from './httpClient';

// UserController: /api/v1/users (same routes as CouponController; see TODO.md · Seguridad)
export const usersApi = {
  getAll: () => http.get('/users'),
  create: (user) => http.post('/users/create', user),
  update: (idUser, user) => http.put(`/users/${idUser}`, user),
  remove: (idUser) => http.delete(`/users/${idUser}`)
};
