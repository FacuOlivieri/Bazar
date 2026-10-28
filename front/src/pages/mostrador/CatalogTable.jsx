import { Icon } from '../../components/ui/Icon';
import { StockCell } from '../../components/ui/StockStamp';
import { EmptyState, ErrorState, SkeletonRows } from '../../components/ui/Feedback';
import { formatNumber, formatPrice } from '../../domain/format';
import { LOAD_STATUS } from '../../hooks/useResource';

const COLUMN_COUNT = 6;

function CatalogRow({ product, inTicket, canAdd, onAdd }) {
  return (
    <tr>
      <td className="col-number product-number">{formatNumber(product.idProduct)}</td>
      <td className="col-name">{product.name}</td>
      <td className="col-brand">{product.brand}</td>
      <td className="col-price">{formatPrice(product.price)}</td>
      <td className="col-stock">
        <StockCell product={product} />
      </td>
      <td className="col-action">
        {inTicket > 0 && (
          <span className="in-ticket" aria-label={`${inTicket} en el ticket`}>
            ×{inTicket}
          </span>
        )}
        <button
          type="button"
          className="btn-add"
          disabled={!canAdd}
          onClick={() => onAdd(product)}
          aria-label={`Agregar ${product.name} al ticket`}
        >
          <Icon name="plus" size={14} strokeWidth={2.6} />
          <span className="btn-add__label">Agregar</span>
        </button>
      </td>
    </tr>
  );
}

export function CatalogTable({ products, status, error, onRetry, query, ticket }) {
  if (status === LOAD_STATUS.ERROR && products.length === 0) {
    return <ErrorState message={error?.message} onRetry={onRetry} />;
  }

  const isLoading = status === LOAD_STATUS.LOADING;
  const isEmpty = !isLoading && products.length === 0;

  return (
    <div className="table-box table-box--ruled">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col" className="col-number">N.º</th>
            <th scope="col">Producto</th>
            <th scope="col" className="col-brand">Marca</th>
            <th scope="col" className="col-price">Precio</th>
            <th scope="col">Stock</th>
            <th scope="col"><span className="sr-only">Acción</span></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && <SkeletonRows columns={COLUMN_COUNT} />}
          {products.map((product) => (
            <CatalogRow
              key={product.idProduct}
              product={product}
              inTicket={ticket.quantityOf(product.idProduct)}
              canAdd={ticket.canAdd(product)}
              onAdd={ticket.add}
            />
          ))}
        </tbody>
      </table>
      {isEmpty && (
        query.trim()
          ? <EmptyState title={`Ningún producto coincide con «${query}»`} hint="Probá con menos palabras o buscá por la marca." />
          : <EmptyState title="Todavía no hay productos" hint="Cargalos desde la pantalla Productos (F3)." />
      )}
    </div>
  );
}
