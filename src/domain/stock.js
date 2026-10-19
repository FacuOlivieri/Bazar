// Mirrors ProductService.LOW_STOCK_QUANTITY in the backend.
export const LOW_STOCK_QUANTITY = 5;

export const STOCK_STATUS = { OK: 'ok', LOW: 'low', OUT: 'out' };

const STAMP_LABELS = { [STOCK_STATUS.LOW]: 'REPONER', [STOCK_STATUS.OUT]: 'SIN STOCK' };
const STAMP_ANGLES = [-4, -2.5, -3.5, -1.5, -3];

export function isLowStock(product) {
  return product.stock < LOW_STOCK_QUANTITY;
}

export function stockStatus(product) {
  if (product.stock <= 0) return STOCK_STATUS.OUT;
  if (isLowStock(product)) return STOCK_STATUS.LOW;
  return STOCK_STATUS.OK;
}

export function stampLabel(status) {
  return STAMP_LABELS[status] ?? '';
}

// Each product keeps the same slight tilt, like a stamp applied by hand.
export function stampAngle(idProduct) {
  return STAMP_ANGLES[idProduct % STAMP_ANGLES.length];
}
