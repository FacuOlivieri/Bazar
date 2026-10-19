import { useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { InlineError, Notice } from '../../components/ui/Feedback';
import { Icon } from '../../components/ui/Icon';
import { PanelHeader } from '../../components/ui/PanelHeader';
import { SearchField } from '../../components/ui/SearchField';
import { Tabs } from '../../components/ui/Tabs';
import { formatDiscount, matchesCoupon, sortCoupons } from '../../domain/coupon';
import { formatNumber, pluralize } from '../../domain/format';
import { useCoupons } from '../../hooks/useCoupons';
import { PANEL_MODE, useEditPanel } from '../../hooks/useEditPanel';
import { CouponForm } from './CouponForm';
import { CouponsTable } from './CouponsTable';
import './cupones.css';

const TABS = [
  { key: 'unused', label: 'Disponibles', filter: (coupon) => !coupon.used },
  { key: 'used', label: 'Usados', filter: (coupon) => coupon.used },
  { key: 'all', label: 'Todos', filter: () => true }
];

const getCouponId = (coupon) => coupon.idCoupon;

const PANEL_MESSAGES = {
  created: (request) => `Se creó el cupón ${request.identifier} (${formatDiscount(request.discount)}).`,
  updated: (request) => `Se guardaron los cambios del cupón ${request.identifier}.`,
  removed: (coupon) => `Se eliminó el cupón ${coupon.identifier}.`
};

// CouponService answers in Spanish (duplicated code, discount out of range, used in a sale);
// only a bare status with no message gets our own copy.
const BARE_STATUS = /^El servidor respondió/;

function describeCouponError(error, kind) {
  if (kind === 'remove' && BARE_STATUS.test(error.message)) {
    return 'No se pudo eliminar. Si el cupón ya se usó en una venta, el sistema no deja borrarlo.';
  }
  return error.message;
}

function emptyCopyFor(tabKey, query) {
  if (query.trim()) return { title: `Ningún cupón coincide con «${query}»`, hint: 'Revisá el código: se escribe sin espacios.' };
  if (tabKey === 'used') return { title: 'Todavía no se usó ningún cupón', hint: 'Cuando un cliente lo use en el mostrador, aparece acá.' };
  if (tabKey === 'unused') return { title: 'No hay cupones disponibles', hint: 'Creá uno con «Nuevo cupón».' };
  return { title: 'Todavía no hay cupones', hint: 'Creá el primero con «Nuevo cupón».' };
}

function panelHeaderFor(panel) {
  if (panel.mode === PANEL_MODE.CREATE) return { title: 'Nuevo cupón', subtitle: 'Arranca disponible para usar una vez' };
  if (panel.mode === PANEL_MODE.EDIT) return { title: `Cupón N.º ${formatNumber(panel.editing.idCoupon)}`, subtitle: 'Editando código y descuento' };
  return { title: 'Cupones', subtitle: 'Descuentos para el mostrador' };
}

function IdlePanel({ unusedCount, onCreate }) {
  return (
    <div className="side-column__body coupons-idle">
      <p className="helper-text">
        Un cupón es un código con un porcentaje de descuento. En el mostrador se escribe el código y el total baja solo. Después de usarlo queda marcado como usado.
      </p>
      <p className="num coupons-idle__count">{pluralize(unusedCount, 'cupón disponible', 'cupones disponibles')}</p>
      <button type="button" className="btn btn--ghost" onClick={onCreate}>
        <Icon name="plus" size={14} strokeWidth={2.6} />
        Nuevo cupón
      </button>
    </div>
  );
}

export function CuponesPage() {
  const book = useCoupons();
  const panel = useEditPanel({
    create: book.createCoupon,
    update: book.updateCoupon,
    remove: book.deleteCoupon,
    getId: getCouponId,
    messages: PANEL_MESSAGES,
    describeError: describeCouponError
  });
  const [tabKey, setTabKey] = useState('unused');
  const [query, setQuery] = useState('');

  const activeTab = TABS.find((tab) => tab.key === tabKey);
  const visibleCoupons = sortCoupons(book.coupons.filter((coupon) => activeTab.filter(coupon) && matchesCoupon(coupon, query)));
  const counts = Object.fromEntries(TABS.map((tab) => [tab.key, book.coupons.filter(tab.filter).length]));
  const header = panelHeaderFor(panel);

  return (
    <AppShell
      railFooter={
        <>
          <p className="rail__footer-title">Cupones</p>
          <p className="num">{pluralize(book.unusedCoupons.length, 'disponible', 'disponibles')}</p>
        </>
      }
    >
      <main className="work">
        <div className="work__header">
          <h1 className="screen-title">Cupones</h1>
          <button type="button" className="btn btn--primary" onClick={panel.startCreate}>
            <Icon name="plus" size={14} strokeWidth={2.6} />
            Nuevo cupón
          </button>
        </div>

        <div className="tabs-row">
          <Tabs label="Vista de cupones" tabs={TABS} activeKey={tabKey} counts={counts} onSelect={setTabKey} />
          <SearchField
            id="filtrar-cupones"
            variant="inline"
            label="Filtrar por código"
            placeholder="Filtrar por código…"
            value={query}
            onChange={setQuery}
          />
        </div>

        {panel.notice && <Notice>{panel.notice}</Notice>}
        {panel.listError && <InlineError>{panel.listError}</InlineError>}

        <CouponsTable
          coupons={visibleCoupons}
          status={book.status}
          error={book.error}
          onRetry={book.reload}
          selectedId={panel.editing?.idCoupon}
          onEdit={panel.startEdit}
          onDelete={panel.remove}
          isBusy={panel.isBusy}
          emptyCopy={emptyCopyFor(tabKey, query)}
        />
      </main>

      <aside className="side-column" aria-label={header.title}>
        <PanelHeader title={header.title} subtitle={header.subtitle} />
        {panel.mode === PANEL_MODE.IDLE ? (
          <IdlePanel unusedCount={book.unusedCoupons.length} onCreate={panel.startCreate} />
        ) : (
          <CouponForm
            key={panel.editing?.idCoupon ?? 'new'}
            coupon={panel.editing}
            onSave={panel.save}
            onCancel={panel.close}
            isBusy={panel.isBusy}
            error={panel.error}
          />
        )}
      </aside>
    </AppShell>
  );
}
