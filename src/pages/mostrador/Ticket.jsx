import { Icon } from '../../components/ui/Icon';
import { EmptyState, InlineError, Notice } from '../../components/ui/Feedback';
import { PanelHeader } from '../../components/ui/PanelHeader';
import { formatDiscount } from '../../domain/coupon';
import { formatNumber, formatPrice, formatToday, pluralize } from '../../domain/format';
import { ClientPicker } from './ClientPicker';
import { CouponField } from './CouponField';
import { TicketLine } from './TicketLine';

function TotalBreakdown({ subtotal, coupon, discount }) {
  return (
    <dl className="ticket-footer__breakdown num">
      <div>
        <dt>Subtotal</dt>
        <dd>{formatPrice(subtotal)}</dd>
      </div>
      <div>
        <dt>
          Cupón {coupon.identifier} ({formatDiscount(coupon.discount)})
        </dt>
        <dd>−{formatPrice(discount)}</dd>
      </div>
    </dl>
  );
}

function TicketFooter({ totals, coupon, needsClient, canCharge, isCharging, onCharge, onGoToClient }) {
  return (
    <div className="ticket-footer">
      {coupon && totals.discount > 0 && <TotalBreakdown subtotal={totals.subtotal} coupon={coupon} discount={totals.discount} />}
      <div className="ticket-footer__total">
        <span className="ticket-footer__label">Total</span>
        <b className="ticket-footer__amount">{formatPrice(totals.total)}</b>
      </div>
      {needsClient && (
        <button type="button" className="link-btn link-btn--sentence" onClick={onGoToClient}>
          Elegí un cliente para poder cobrar <Icon name="arrowRight" size={14} strokeWidth={2.4} />
        </button>
      )}
      <button type="button" className="btn-pay" disabled={!canCharge || isCharging} onClick={onCharge}>
        {isCharging ? 'COBRANDO…' : 'COBRAR · F12'}
      </button>
    </div>
  );
}

function LastSaleNotice({ sale }) {
  return (
    <Notice className="ticket__notice">
      Venta N.º {formatNumber(sale.id)} registrada · <b className="num">{formatPrice(sale.totalPrice)}</b> · {sale.clientName}
      {sale.couponIdentifier && ` · cupón ${sale.couponIdentifier} (−${formatDiscount(sale.couponDiscount)})`}
    </Notice>
  );
}

export function Ticket({ ticket, totals, productsById, clientPicker, couponField, lastSale, chargeError, isCharging, canCharge, onCharge }) {
  const needsClient = !ticket.isEmpty && !clientPicker.selectedClient;

  return (
    <aside className="side-column" aria-label="Ticket de venta">
      <PanelHeader
        title="Venta nueva"
        subtitle={`${formatToday()} · ${pluralize(ticket.lines.length, 'artículo', 'artículos')} · ${pluralize(ticket.units, 'unidad', 'unidades')}`}
      />

      {lastSale && <LastSaleNotice sale={lastSale} />}

      <div className="side-column__body ticket__client">
        <ClientPicker {...clientPicker} />
      </div>

      <div className="ticket__lines">
        {ticket.isEmpty && (
          <EmptyState title="El ticket está vacío" hint="Buscá un producto por nombre o marca y tocá «Agregar»." />
        )}
        {ticket.lines.map((line) => {
          const product = productsById.get(line.idProduct);
          return product ? (
            <TicketLine
              key={line.idProduct}
              line={line}
              product={product}
              onChangeQuantity={ticket.changeQuantity}
              onRemove={ticket.remove}
            />
          ) : null;
        })}
        {chargeError && <InlineError>{chargeError}</InlineError>}
      </div>

      {!ticket.isEmpty && (
        <div className="side-column__body ticket__coupon">
          <CouponField {...couponField} />
        </div>
      )}

      <TicketFooter
        totals={totals}
        coupon={couponField.appliedCoupon}
        needsClient={needsClient}
        canCharge={canCharge}
        isCharging={isCharging}
        onCharge={onCharge}
        onGoToClient={() => clientPicker.inputRef.current?.focus()}
      />
    </aside>
  );
}
