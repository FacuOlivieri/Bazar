import { EmptyState, ErrorState, SkeletonRows } from '../../components/ui/Feedback';
import { RowActions } from '../../components/ui/RecordForm';
import { formatDiscount } from '../../domain/coupon';
import { formatNumber } from '../../domain/format';
import { LOAD_STATUS } from '../../hooks/useResource';

const COLUMN_COUNT = 5;

function CouponStatus({ used }) {
  return used ? <span className="used-mark">Usado</span> : <span className="available-mark">Disponible</span>;
}

function CouponRow({ coupon, isSelected, onEdit, onDelete, isBusy }) {
  return (
    <tr className={isSelected ? 'is-selected' : undefined}>
      <td className="col-number product-number">{formatNumber(coupon.idCoupon)}</td>
      <td>
        <span className={coupon.used ? 'coupon-code is-used' : 'coupon-code'}>{coupon.identifier}</span>
      </td>
      <td className="col-discount">{formatDiscount(coupon.discount)}</td>
      <td>
        <CouponStatus used={coupon.used} />
      </td>
      <td className="col-action">
        <RowActions recordName={`el cupón ${coupon.identifier}`} onEdit={() => onEdit(coupon)} onDelete={() => onDelete(coupon)} isBusy={isBusy} />
      </td>
    </tr>
  );
}

export function CouponsTable({ coupons, status, error, onRetry, selectedId, onEdit, onDelete, isBusy, emptyCopy }) {
  if (status === LOAD_STATUS.ERROR && coupons.length === 0) {
    return <ErrorState message={error?.message} onRetry={onRetry} />;
  }

  const isLoading = status === LOAD_STATUS.LOADING;

  return (
    <div className="table-box">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col" className="col-number">N.º</th>
            <th scope="col">Código</th>
            <th scope="col" className="col-discount">Descuento</th>
            <th scope="col">Estado</th>
            <th scope="col"><span className="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && <SkeletonRows columns={COLUMN_COUNT} />}
          {coupons.map((coupon) => (
            <CouponRow
              key={coupon.idCoupon}
              coupon={coupon}
              isSelected={coupon.idCoupon === selectedId}
              onEdit={onEdit}
              onDelete={onDelete}
              isBusy={isBusy}
            />
          ))}
        </tbody>
      </table>
      {!isLoading && coupons.length === 0 && <EmptyState title={emptyCopy.title} hint={emptyCopy.hint} />}
    </div>
  );
}
