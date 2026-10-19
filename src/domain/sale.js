import { todayIso } from './format';

// Body for POST /api/v1/sales/create.
export function buildSaleRequest(clientId, lines) {
  return {
    date: todayIso(),
    client: { idClientDTO: clientId },
    products: lines.map((line) => ({ id: line.idProduct, quantity: line.quantity }))
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
