import { Icon } from '../../components/ui/Icon';
import { EmptyState, InlineError, Notice } from '../../components/ui/Feedback';
import { PanelHeader } from '../../components/ui/PanelHeader';
import { formatNumber, formatPrice, formatToday, pluralize } from '../../domain/format';
import { ClientPicker } from './ClientPicker';
import { TicketLine } from './TicketLine';

function TicketFooter({ total, needsClient, canCharge, isCharging, onCharge, onGoToClient }) {
  return (
    <div className="ticket-footer">
      <div className="ticket-footer__total">
        <span className="ticket-footer__label">Total</span>
        <b className="ticket-footer__amount">{formatPrice(total)}</b>
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

export function Ticket({ ticket, productsById, clientPicker, lastSale, chargeError, isCharging, canCharge, onCharge }) {
  const needsClient = !ticket.isEmpty && !clientPicker.selectedClient;

  return (
    <aside className="side-column" aria-label="Ticket de venta">
      <PanelHeader
        title="Venta nueva"
        subtitle={`${formatToday()} · ${pluralize(ticket.lines.length, 'artículo', 'artículos')} · ${pluralize(ticket.units, 'unidad', 'unidades')}`}
      />

      {lastSale && (
        <Notice className="ticket__notice">
          Venta N.º {formatNumber(lastSale.id)} registrada · <b className="num">{formatPrice(lastSale.totalPrice)}</b> · {lastSale.clientName}
        </Notice>
      )}

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

      <TicketFooter
        total={ticket.total}
        needsClient={needsClient}
        canCharge={canCharge}
        isCharging={isCharging}
        onCharge={onCharge}
        onGoToClient={() => clientPicker.inputRef.current?.focus()}
      />
    </aside>
  );
}
