import { useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { PanelHeader } from '../../components/ui/PanelHeader';
import { Field } from '../../components/ui/RecordForm';
import { clientFullName } from '../../domain/client';
import { formatNumber, formatPrice, pluralize, todayIso } from '../../domain/format';
import {
  formatSaleDate,
  hasSaleFilters,
  matchesSaleFilters,
  sortSalesNewestFirst,
  summarizeSales
} from '../../domain/saleHistory';
import { useClients } from '../../hooks/useClients';
import { useSales } from '../../hooks/useSales';
import { ClientPicker } from '../mostrador/ClientPicker';
import { SaleDetail } from './SaleDetail';
import { SalesTable } from './SalesTable';
import './ventas.css';

const NO_DATES = { from: '', to: '' };

function emptyCopyFor(filters, totalCount) {
  if (filters.from && filters.to && filters.from > filters.to) {
    return { title: 'El rango de fechas está al revés', hint: '«Desde» tiene que ser anterior o igual a «Hasta».' };
  }
  if (hasSaleFilters(filters)) {
    return { title: 'Ninguna venta coincide con los filtros', hint: 'Probá con un rango de fechas más amplio o con otro cliente.' };
  }
  if (totalCount === 0) return { title: 'Todavía no hay ventas', hint: 'Las ventas que se cobran en el Mostrador aparecen acá.' };
  return { title: 'No hay ventas para mostrar', hint: '' };
}

function panelHeaderFor(sale) {
  if (!sale) return { title: 'Detalle de venta', subtitle: 'Tocá «Ver» en una venta para ver su ticket' };
  const client = sale.client ? clientFullName(sale.client) : 'Sin cliente';
  return { title: `Venta N.º ${formatNumber(sale.id)}`, subtitle: `${formatSaleDate(sale.date)} · ${client}` };
}

function IdlePanel({ summary, isFiltered }) {
  return (
    <div className="side-column__body sales-idle">
      <p className="helper-text">
        Filtrá por cliente, por fechas o por las dos cosas a la vez. Para ver un solo día, poné la misma fecha en «Desde» y «Hasta», o tocá «Hoy».
      </p>
      <p className="num sales-idle__count">{pluralize(summary.count, isFiltered ? 'venta filtrada' : 'venta', isFiltered ? 'ventas filtradas' : 'ventas')}</p>
      <p className="num sales-idle__amount">{formatPrice(summary.amount)}</p>
    </div>
  );
}

function SalesFilters({ clients, filters, client, onChange, onClientChange, onClear }) {
  const today = todayIso();
  return (
    <div className="sales-filters" role="search" aria-label="Filtros de ventas">
      <div className="sales-filters__client">
        <ClientPicker clients={clients} selectedClient={client} onSelect={onClientChange} onClear={() => onClientChange(null)} />
      </div>
      <div className="sales-filters__dates">
        <Field
          id="ventas-desde"
          label="Desde"
          type="date"
          className="input num"
          max={filters.to || undefined}
          value={filters.from}
          onChange={(event) => onChange({ from: event.target.value })}
        />
        <Field
          id="ventas-hasta"
          label="Hasta"
          type="date"
          className="input num"
          min={filters.from || undefined}
          value={filters.to}
          onChange={(event) => onChange({ to: event.target.value })}
        />
        <div className="sales-filters__actions">
          <button type="button" className="link-btn" onClick={() => onChange({ from: today, to: today })}>
            Hoy
          </button>
          {hasSaleFilters(filters) && (
            <button type="button" className="link-btn link-btn--quiet" onClick={onClear}>
              Limpiar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function VentasPage() {
  const book = useSales();
  const { clients } = useClients();
  const [client, setClient] = useState(null);
  const [dates, setDates] = useState(NO_DATES);
  const [selectedId, setSelectedId] = useState(null);

  const filters = { clientId: client?.idClientDTO ?? null, ...dates };
  const isFiltered = hasSaleFilters(filters);
  const visibleSales = sortSalesNewestFirst(book.sales.filter((sale) => matchesSaleFilters(sale, filters)));
  const summary = summarizeSales(visibleSales);
  const selectedSale = book.sales.find((sale) => sale.id === selectedId) ?? null;
  const header = panelHeaderFor(selectedSale);

  function clearFilters() {
    setClient(null);
    setDates(NO_DATES);
  }

  return (
    <AppShell
      railFooter={
        <>
          <p className="rail__footer-title">Ventas</p>
          <p className="num">{pluralize(book.sales.length, 'venta registrada', 'ventas registradas')}</p>
        </>
      }
    >
      <main className="work">
        <div className="work__header">
          <h1 className="screen-title">Ventas</h1>
        </div>

        <SalesFilters
          clients={clients}
          filters={filters}
          client={client}
          onChange={(change) => setDates((current) => ({ ...current, ...change }))}
          onClientChange={setClient}
          onClear={clearFilters}
        />

        <p className="sales-result num" aria-live="polite">
          {pluralize(summary.count, 'venta', 'ventas')} · <b>{formatPrice(summary.amount)}</b>
        </p>

        <SalesTable
          sales={visibleSales}
          status={book.status}
          error={book.error}
          onRetry={book.reload}
          selectedId={selectedId}
          onSelect={(sale) => setSelectedId(sale.id)}
          emptyCopy={emptyCopyFor(filters, book.sales.length)}
        />
      </main>

      <aside className="side-column" aria-label={header.title}>
        <PanelHeader title={header.title} subtitle={header.subtitle} />
        {selectedSale ? (
          <SaleDetail key={selectedSale.id} sale={selectedSale} onClose={() => setSelectedId(null)} />
        ) : (
          <IdlePanel summary={summary} isFiltered={isFiltered} />
        )}
      </aside>
    </AppShell>
  );
}
