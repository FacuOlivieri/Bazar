import { useCallback } from 'react';
import { salesApi } from '../api/salesApi';
import { todayIso } from '../domain/format';
import { useResource } from './useResource';

const NOT_LOADED = async () => null;

// Today's sales count and amount (GET /sales/summary/{date}). Only ADMIN may read it:
// with `enabled: false` nothing is requested and `isAvailable` is false.
export function useDaySummary({ enabled = true } = {}) {
  const loadToday = useCallback(() => salesApi.getDaySummary(todayIso()), []);
  const { data, reload } = useResource(enabled ? loadToday : NOT_LOADED);
  return {
    isAvailable: enabled,
    salesCount: data?.totalSales ?? 0,
    salesAmount: data?.totalSalePriceAmount ?? 0,
    reload
  };
}
