import { http } from './httpClient';

// ClientController: /api/v1/clients
export const clientsApi = {
  getAll: () => http.get('/clients'),
  create: (client) => http.post('/clients/create', client),
  update: (idClient, client) => http.put(`/clients/${idClient}`, client),
  remove: (idClient) => http.delete(`/clients/${idClient}`)
};
