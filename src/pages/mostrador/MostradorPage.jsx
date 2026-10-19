import { useCallback, useRef, useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { SearchField } from '../../components/ui/SearchField';
import { applyDiscount } from '../../domain/coupon';
import { formatPrice, formatToday, pluralize } from '../../domain/format';
import { matchesProduct } from '../../domain/product';
import { useClients } from '../../hooks/useClients';
import { useUnusedCoupons } from '../../hooks/useCoupons';
import { useDaySummary } from '../../hooks/useDaySummary';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useProducts } from '../../hooks/useProducts';
import { useTicket } from '../../hooks/useTicket';
import { CatalogTable } from './CatalogTable';
import { Ticket } from './Ticket';
import { useCharge } from './useCharge';
import './mostrador.css';

function DaySummary({ salesCount, salesAmount }) {
  return (
    <>
      <p className="rail__footer-title">Hoy · {formatToday()}</p>
      <p className="num">
        {pluralize(salesCount, 'venta', 'ventas')} · {formatPrice(salesAmount)}
      </p>
    </>
  );
}

export function MostradorPage() {
  const products = useProducts();
  const { clients, clientsById } = useClients();
  const daySummary = useDaySummary();
  const { unusedCoupons, reload: reloadCoupons } = useUnusedCoupons();
  const ticket = useTicket(products.productsById);

  const [query, setQuery] = useState('');
  const [clientId, setClientId] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const searchRef = useRef(null);
  const clientInputRef = useRef(null);

  const selectedClient = clientId ? clientsById.get(clientId) : null;
  const visibleProducts = products.products.filter((product) => matchesProduct(product, query));
  const canCharge = !ticket.isEmpty && Boolean(selectedClient);
  const total = coupon ? applyDiscount(ticket.total, coupon.discount) : ticket.total;
  const totals = { subtotal: ticket.total, discount: ticket.total - total, total };

  const { clear: clearTicket } = ticket;
  const { reload: reloadProducts } = products;
  const { reload: reloadDaySummary } = daySummary;

  // After a sale: empty the ticket and refresh stock, coupons and today's totals from the backend.
  const handleCharged = useCallback(() => {
    clearTicket();
    setClientId(null);
    setCoupon(null);
    reloadProducts();
    reloadCoupons();
    reloadDaySummary();
  }, [clearTicket, reloadProducts, reloadCoupons, reloadDaySummary]);

  const sale = useCharge({ onCharged: handleCharged });

  function addToTicket(product) {
    sale.dismiss();
    ticket.add(product);
  }

  function chargeTicket() {
    if (canCharge && !sale.isCharging) sale.charge(selectedClient, ticket.lines, coupon);
  }

  useKeyboardShortcuts({
    F2: () => searchRef.current?.focus(),
    F12: chargeTicket
  });

  return (
    <AppShell railFooter={<DaySummary salesCount={daySummary.salesCount} salesAmount={daySummary.salesAmount} />}>
      <main className="work">
        <div className="work__header">
          <h1 className="screen-title">Mostrador</h1>
        </div>

        <SearchField
          id="buscar"
          label="Buscar producto por nombre o marca"
          placeholder="Buscar producto o marca…"
          shortcut="F2"
          value={query}
          onChange={setQuery}
          inputRef={searchRef}
        />

        <CatalogTable
          products={visibleProducts}
          status={products.status}
          error={products.error}
          onRetry={products.reload}
          query={query}
          ticket={{ ...ticket, add: addToTicket }}
        />
      </main>

      <Ticket
        ticket={ticket}
        totals={totals}
        productsById={products.productsById}
        couponField={{
          unusedCoupons,
          appliedCoupon: coupon,
          onApply: setCoupon,
          onRemove: () => setCoupon(null)
        }}
        clientPicker={{
          clients,
          selectedClient,
          onSelect: (client) => setClientId(client.idClientDTO),
          onClear: () => setClientId(null),
          inputRef: clientInputRef
        }}
        lastSale={sale.lastSale}
        chargeError={sale.error}
        isCharging={sale.isCharging}
        canCharge={canCharge}
        onCharge={chargeTicket}
      />
    </AppShell>
  );
}
