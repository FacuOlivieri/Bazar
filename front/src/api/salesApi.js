import { http } from './httpClient';

// SaleController: /api/v1/sales
export const salesApi = {
  getAll: () => http.get('/sales'),
  create: (saleRequest) => http.post('/sales/create', saleRequest),
  getDaySummary: (isoDate) => http.get(`/sales/summary/${isoDate}`)
};
