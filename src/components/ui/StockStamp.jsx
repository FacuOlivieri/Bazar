import { formatQuantity } from '../../domain/format';
import { STOCK_STATUS, stampAngle, stampLabel, stockStatus } from '../../domain/stock';

// The signature carton mark: REPONER / SIN STOCK. Renders nothing when stock is fine.
export function StockStamp({ product }) {
  const status = stockStatus(product);
  if (status === STOCK_STATUS.OK) return null;
  return (
    <span className="stamp" style={{ transform: `rotate(${stampAngle(product.idProduct)}deg)` }}>
      {stampLabel(status)}
    </span>
  );
}

export function StockCell({ product }) {
  return (
    <>
      <span className="figure">{formatQuantity(product.stock)} u.</span>
      <StockStamp product={product} />
    </>
  );
}
