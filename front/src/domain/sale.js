import { todayIso } from './format';

// Body for POST /api/v1/sales/create. The coupon is optional and travels by its identifier.
export function buildSaleRequest(clientId, lines, coupon = null) {
  return {
    date: todayIso(),
    client: { idClientDTO: clientId },
    products: lines.map((line) => ({ id: line.idProduct, quantity: line.quantity })),
    ...(coupon && { coupon: { identifier: coupon.identifier } })
  };
}

export function lineSubtotal(line, product) {
  return product.price * line.quantity;
}

export function ticketTotal(lines, productsById) {
  return lines.reduce((sum, line) => {
    const product = productsById.get(line.idProduct);
    return product ? sum + lineSubtotal(line, product) : sum;
  }, 0);
}

export function countUnits(lines) {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}
