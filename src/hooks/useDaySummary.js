import { useCallback } from 'react';
import { salesApi } from '../api/salesApi';
import { todayIso } from '../domain/format';
import { useResource } from './useResource';

// Today's sales count and amount (GET /sales/summary/{date}).
export function useDaySummary() {
  const loadToday = useCallback(() => salesApi.getDaySummary(todayIso()), []);
  const { data, reload } = useResource(loadToday);
  return {
    salesCount: data?.totalSales ?? 0,
    salesAmount: data?.totalSalePriceAmount ?? 0,
    reload
  };
}
