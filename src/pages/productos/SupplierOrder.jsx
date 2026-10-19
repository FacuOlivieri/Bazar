import { formatNumber, formatQuantity } from '../../domain/format';
import { groupByBrand } from '../../domain/product';
import { LOW_STOCK_QUANTITY } from '../../domain/stock';

// Idle side panel: what to restock, grouped by brand like an order sheet for the supplier.
export function SupplierOrder({ lowStockProducts, onEdit }) {
  if (lowStockProducts.length === 0) {
    return (
      <div className="side-column__body">
        <p className="helper-text">No hay nada para reponer: todo tiene {LOW_STOCK_QUANTITY} unidades o más.</p>
      </div>
    );
  }

  return (
    <div className="side-column__body supplier-order">
      {groupByBrand(lowStockProducts).map((group) => (
        <section key={group.brand} aria-label={group.brand}>
          <h3 className="supplier-order__brand">{group.brand}</h3>
          {group.products.map((product) => (
            <div key={product.idProduct} className="supplier-order__line">
              <div>
                <p className="supplier-order__name">{product.name}</p>
                <p className="num supplier-order__meta">
                  N.º {formatNumber(product.idProduct)} · quedan {formatQuantity(product.stock)} u.
                </p>
              </div>
              <button type="button" className="link-btn" onClick={() => onEdit(product)} aria-label={`Editar ${product.name}`}>
                Editar
              </button>
            </div>
          ))}
        </section>
      ))}
      <p className="helper-text supplier-order__hint">Tocá «Editar» para actualizar el stock cuando llegue la mercadería.</p>
    </div>
  );
}
