import { RowActions } from '../../components/ui/RecordForm';
import { StockCell } from '../../components/ui/StockStamp';
import { EmptyState, ErrorState, SkeletonRows } from '../../components/ui/Feedback';
import { formatNumber, formatPrice } from '../../domain/format';
import { LOAD_STATUS } from '../../hooks/useResource';

const COLUMN_COUNT = 6;

function ProductRow({ product, isSelected, onEdit, onDelete, isBusy }) {
  return (
    <tr className={isSelected ? 'is-selected' : undefined}>
      <td className="col-number product-number">{formatNumber(product.idProduct)}</td>
      <td className="col-name">{product.name}</td>
      <td className="col-brand">{product.brand}</td>
      <td className="col-price">{formatPrice(product.price)}</td>
      <td className="col-stock">
        <StockCell product={product} />
      </td>
      <td className="col-action">
        <RowActions recordName={product.name} onEdit={() => onEdit(product)} onDelete={() => onDelete(product)} isBusy={isBusy} />
      </td>
    </tr>
  );
}

export function ProductsTable({ products, status, error, onRetry, selectedId, onEdit, onDelete, isBusy, emptyCopy }) {
  if (status === LOAD_STATUS.ERROR && products.length === 0) {
    return <ErrorState message={error?.message} onRetry={onRetry} />;
  }

  const isLoading = status === LOAD_STATUS.LOADING;

  return (
    <div className="table-box">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col" className="col-number">N.º</th>
            <th scope="col">Producto</th>
            <th scope="col" className="col-brand">Marca</th>
            <th scope="col" className="col-price">Precio</th>
            <th scope="col">Stock</th>
            <th scope="col"><span className="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && <SkeletonRows columns={COLUMN_COUNT} />}
          {products.map((product) => (
            <ProductRow
              key={product.idProduct}
              product={product}
              isSelected={product.idProduct === selectedId}
              onEdit={onEdit}
              onDelete={onDelete}
              isBusy={isBusy}
            />
          ))}
        </tbody>
      </table>
      {!isLoading && products.length === 0 && <EmptyState title={emptyCopy.title} hint={emptyCopy.hint} />}
    </div>
  );
}
