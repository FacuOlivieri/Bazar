import { Icon } from '../../components/ui/Icon';
import { formatPrice, formatQuantity } from '../../domain/format';
import { lineSubtotal } from '../../domain/sale';

export function TicketLine({ line, product, onChangeQuantity, onRemove }) {
  const atMax = line.quantity >= product.stock;

  return (
    <div className="ticket-line">
      <div className="ticket-line__info">
        <p className="ticket-line__name">{product.name}</p>
        <p className="ticket-line__meta">
          {product.brand} · {formatPrice(product.price)} c/u
        </p>
      </div>
      <b className="num ticket-line__subtotal">{formatPrice(lineSubtotal(line, product))}</b>
      <div className="ticket-line__qty">
        <button
          type="button"
          className="stepper"
          onClick={() => onChangeQuantity(product.idProduct, -1)}
          aria-label={`Quitar una unidad de ${product.name}`}
        >
          <Icon name="minus" size={12} strokeWidth={2.8} />
        </button>
        <span className="figure ticket-line__count">{formatQuantity(line.quantity)}</span>
        <button
          type="button"
          className="stepper"
          disabled={atMax}
          onClick={() => onChangeQuantity(product.idProduct, 1)}
          aria-label={`Sumar una unidad de ${product.name}`}
        >
          <Icon name="plus" size={12} strokeWidth={2.8} />
        </button>
      </div>
      <button
        type="button"
        className="icon-btn ticket-line__remove"
        onClick={() => onRemove(product.idProduct)}
        aria-label={`Sacar ${product.name} del ticket`}
      >
        <Icon name="trash" size={18} strokeWidth={2} />
      </button>
    </div>
  );
}
