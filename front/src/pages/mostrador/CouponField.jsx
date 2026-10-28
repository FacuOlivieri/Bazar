import { useState } from 'react';
import { findCouponByIdentifier, formatDiscount, normalizeIdentifier } from '../../domain/coupon';

function AppliedCoupon({ coupon, onRemove }) {
  return (
    <div className="coupon-stub">
      <span className="coupon-stub__label">Cupón</span>
      <span className="coupon-code">{coupon.identifier}</span>
      <span className="coupon-stub__discount num">−{formatDiscount(coupon.discount)}</span>
      <button type="button" className="link-btn coupon-stub__remove" onClick={onRemove}>
        Quitar
      </button>
    </div>
  );
}

// Optional coupon for the sale: the code is checked against the coupons still unused.
export function CouponField({ unusedCoupons, appliedCoupon, onApply, onRemove }) {
  const [code, setCode] = useState('');
  const [notFound, setNotFound] = useState(null);

  if (appliedCoupon) {
    return <AppliedCoupon coupon={appliedCoupon} onRemove={onRemove} />;
  }

  function apply(event) {
    event.preventDefault();
    if (!code) return;
    const coupon = findCouponByIdentifier(unusedCoupons, code);
    if (!coupon) {
      setNotFound(code);
      return;
    }
    setCode('');
    setNotFound(null);
    onApply(coupon);
  }

  return (
    <form className="coupon-field" onSubmit={apply}>
      <label htmlFor="cupon" className="field-label">
        Cupón <span className="coupon-field__optional">(opcional)</span>
      </label>
      <div className="coupon-field__row">
        <input
          id="cupon"
          className="input coupon-input"
          type="text"
          autoComplete="off"
          placeholder="Código"
          value={code}
          onChange={(event) => {
            setCode(normalizeIdentifier(event.target.value));
            setNotFound(null);
          }}
        />
        <button type="submit" className="btn btn--ghost" disabled={!code}>
          Aplicar
        </button>
      </div>
      {notFound && (
        <p className="helper-text coupon-field__error" role="alert">
          No hay un cupón disponible con el código {notFound}. Puede que no exista o que ya se haya usado.
        </p>
      )}
    </form>
  );
}
