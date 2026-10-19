import { http } from './httpClient';

// CouponController: /api/v1/coupons
export const couponsApi = {
  getAll: () => http.get('/coupons'),
  getUnused: () => http.get('/coupons/unused'),
  create: (coupon) => http.post('/coupons/create', coupon),
  update: (idCoupon, coupon) => http.put(`/coupons/${idCoupon}`, coupon),
  remove: (idCoupon) => http.delete(`/coupons/${idCoupon}`)
};
