export function hasSaleFilters(filters) {
  return filters.clientId != null || Boolean(filters.from) || Boolean(filters.to);
}

// Client and date range combine (AND). Dates are YYYY-MM-DD, so plain string order is calendar
// order; an empty end leaves that side of the range open.
export function matchesSaleFilters(sale, { clientId, from, to }) {
  if (clientId != null && sale.client?.idClientDTO !== clientId) return false;
  if (from && sale.date < from) return false;
  if (to && sale.date > to) return false;
  return true;
}

export function sortSalesNewestFirst(sales) {
  return [...sales].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
}

// "2026-10-19" → "19/10/2026". Built from the parts: new Date(iso) would read it as UTC midnight
// and show the previous day in Argentina.
export function formatSaleDate(iso) {
  const [year, month, day] = String(iso ?? '').split('-');
  return day ? `${day}/${month}/${year}` : '';
}

export function summarizeSales(sales) {
  return {
    count: sales.length,
    amount: sales.reduce((sum, sale) => sum + (Number(sale.totalPrice) || 0), 0)
  };
}

export function saleUnits(sale) {
  return (sale.products ?? []).reduce((sum, line) => sum + (line.quantity ?? 0), 0);
}

// Before discount: the sum of the stored line totals.
export function saleSubtotal(sale) {
  return (sale.products ?? []).reduce((sum, line) => sum + (Number(line.subtotal) || 0), 0);
}
