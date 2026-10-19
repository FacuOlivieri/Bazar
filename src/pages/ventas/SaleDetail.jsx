import { formatDiscount } from '../../domain/coupon';
import { formatPrice, formatQuantity } from '../../domain/format';
import { saleSubtotal } from '../../domain/saleHistory';

// Sales recorded before the backend kept a copy of name and price come with those fields empty.
function SaleLine({ line }) {
  return (
    <li className="sale-line">
      <div className="sale-line__info">
        <p className="sale-line__name">{line.productName || 'Producto sin nombre'}</p>
        <p className="sale-line__meta num">
          ×{formatQuantity(line.quantity)}
          {line.unitPrice != null && ` · ${formatPrice(line.unitPrice)} c/u`}
        </p>
      </div>
      <b className="num sale-line__subtotal">{formatPrice(line.subtotal)}</b>
    </li>
  );
}

function CouponBreakdown({ sale }) {
  const subtotal = saleSubtotal(sale);
  return (
    <dl className="sale-detail__breakdown num">
      <div>
        <dt>Subtotal</dt>
        <dd>{formatPrice(subtotal)}</dd>
      </div>
      <div>
        <dt>
          Cupón <span className="coupon-code">{sale.coupon.identifier}</span> ({formatDiscount(sale.coupon.discount)})
        </dt>
        <dd>−{formatPrice(subtotal - sale.totalPrice)}</dd>
      </div>
    </dl>
  );
}

// Read-only ticket of a past sale: what was sold, at what price, and what was charged.
export function SaleDetail({ sale, onClose }) {
  const lines = sale.products ?? [];
  return (
    <div className="sale-detail">
      <ul className="sale-detail__lines side-column__body">
        {lines.map((line, index) => (
          <SaleLine key={line.id ?? index} line={line} />
        ))}
      </ul>
      <div className="sale-detail__footer">
        {sale.coupon && <CouponBreakdown sale={sale} />}
        <div className="sale-detail__total">
          <span className="sale-detail__label">Total</span>
          <b className="sale-detail__amount">{formatPrice(sale.totalPrice)}</b>
        </div>
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
