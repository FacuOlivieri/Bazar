import { EmptyState, ErrorState, SkeletonRows } from '../../components/ui/Feedback';
import { formatNumber, formatPrice, formatQuantity } from '../../domain/format';
import { formatSaleDate, saleUnits } from '../../domain/saleHistory';
import { LOAD_STATUS } from '../../hooks/useResource';

const COLUMN_COUNT = 7;
const MISSING = '—';

function SaleRow({ sale, isSelected, onSelect }) {
  const client = sale.client;
  return (
    <tr className={isSelected ? 'is-selected' : undefined}>
      <td className="col-number product-number">{formatNumber(sale.id)}</td>
      <td className="col-date num">{formatSaleDate(sale.date)}</td>
      <td className="col-name">
        {client ? (
          <>
            <span className="client-surname">{client.surname}</span>, {client.name}
          </>
        ) : (
          MISSING
        )}
      </td>
      <td className="col-units num">{formatQuantity(saleUnits(sale))}</td>
      <td className="col-coupon">{sale.coupon ? <span className="coupon-code">{sale.coupon.identifier}</span> : MISSING}</td>
      <td className="col-price">{formatPrice(sale.totalPrice)}</td>
      <td className="col-action">
        <button
          type="button"
          className="link-btn"
          aria-pressed={isSelected}
          aria-label={`Ver la venta N.º ${formatNumber(sale.id)}`}
          onClick={() => onSelect(sale)}
        >
          Ver
        </button>
      </td>
    </tr>
  );
}

export function SalesTable({ sales, status, error, onRetry, selectedId, onSelect, emptyCopy }) {
  if (status === LOAD_STATUS.ERROR && sales.length === 0) {
    return <ErrorState message={error?.message} onRetry={onRetry} />;
  }

  const isLoading = status === LOAD_STATUS.LOADING;

  return (
    <div className="table-box">
      <table className="data-table sales-table">
        <thead>
          <tr>
            <th scope="col" className="col-number">N.º</th>
            <th scope="col" className="col-date">Fecha</th>
            <th scope="col">Cliente</th>
            <th scope="col" className="col-units">Unidades</th>
            <th scope="col" className="col-coupon">Cupón</th>
            <th scope="col" className="col-price">Total</th>
            <th scope="col"><span className="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && <SkeletonRows columns={COLUMN_COUNT} />}
          {sales.map((sale) => (
            <SaleRow key={sale.id} sale={sale} isSelected={sale.id === selectedId} onSelect={onSelect} />
          ))}
        </tbody>
      </table>
      {!isLoading && sales.length === 0 && <EmptyState title={emptyCopy.title} hint={emptyCopy.hint} />}
    </div>
  );
}
