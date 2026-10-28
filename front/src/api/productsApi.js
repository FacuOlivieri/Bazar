import { http } from './httpClient';

// ProductController: /api/v1/products
export const productsApi = {
  getAll: () => http.get('/products'),
  getLowStock: () => http.get('/products/low_stock'),
  create: (product) => http.post('/products/create', product),
  update: (idProduct, product) => http.put(`/products/${idProduct}`, product),
  remove: (idProduct) => http.delete(`/products/${idProduct}`)
};
