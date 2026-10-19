import { useCallback, useMemo } from 'react';
import { couponsApi } from '../api/couponsApi';
import { useResource } from './useResource';

const NO_COUPONS = [];

// All coupons (used and unused), with the CRUD calls the Cupones screen needs.
export function useCoupons() {
  const { data, status, error, reload } = useResource(couponsApi.getAll);
  const coupons = data ?? NO_COUPONS;
  const unusedCoupons = useMemo(() => coupons.filter((coupon) => !coupon.used), [coupons]);

  const createCoupon = useCallback(
    async (request) => {
      const created = await couponsApi.create(request);
      await reload();
      return created;
    },
    [reload]
  );

  const updateCoupon = useCallback(
    async (idCoupon, request) => {
      const updated = await couponsApi.update(idCoupon, request);
      await reload();
      return updated;
    },
    [reload]
  );

  const deleteCoupon = useCallback(
    async (idCoupon) => {
      await couponsApi.remove(idCoupon);
      await reload();
    },
    [reload]
  );

  return { coupons, unusedCoupons, status, error, reload, createCoupon, updateCoupon, deleteCoupon };
}

// Only the coupons still available, for the counter (GET /coupons/unused).
export function useUnusedCoupons() {
  const { data, reload } = useResource(couponsApi.getUnused);
  return { unusedCoupons: data ?? NO_COUPONS, reload };
}
