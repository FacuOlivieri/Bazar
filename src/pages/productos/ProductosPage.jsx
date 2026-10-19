import { useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { InlineError, Notice } from '../../components/ui/Feedback';
import { Icon } from '../../components/ui/Icon';
import { PanelHeader } from '../../components/ui/PanelHeader';
import { SearchField } from '../../components/ui/SearchField';
import { formatNumber, pluralize } from '../../domain/format';
import { matchesProduct } from '../../domain/product';
import { isLowStock, LOW_STOCK_QUANTITY } from '../../domain/stock';
import { PANEL_MODE, useEditPanel } from '../../hooks/useEditPanel';
import { useProducts } from '../../hooks/useProducts';
import { ProductForm } from './ProductForm';
import { ProductsTable } from './ProductsTable';
import { SupplierOrder } from './SupplierOrder';
import './productos.css';

const TABS = [
  { key: 'all', label: 'Todos', filter: () => true },
  { key: 'low', label: 'Stock bajo', filter: isLowStock }
];

const getProductId = (product) => product.idProduct;

const PANEL_MESSAGES = {
  created: (request) => `«${request.name}» se agregó al catálogo.`,
  updated: (request) => `Se guardaron los cambios de «${request.name}».`,
  removed: (product) => `«${product.name}» se eliminó del catálogo.`
};

function emptyCopyFor(tabKey, query) {
  if (query.trim()) return { title: `Nada coincide con «${query}»`, hint: 'Probá con menos palabras o buscá por la marca.' };
  if (tabKey === 'low') return { title: 'No hay productos para reponer', hint: `Todo el catálogo tiene ${LOW_STOCK_QUANTITY} unidades o más.` };
  return { title: 'Todavía no hay productos', hint: 'Cargá el primero con «Nuevo producto».' };
}

function panelHeaderFor(panel) {
  if (panel.mode === PANEL_MODE.CREATE) return { title: 'Nuevo producto', subtitle: 'Se guarda en el catálogo del local' };
  if (panel.mode === PANEL_MODE.EDIT) return { title: `Producto N.º ${formatNumber(panel.editing.idProduct)}`, subtitle: 'Editando precio y stock' };
  return { title: 'Pedido al proveedor', subtitle: 'Lo que hay que reponer, por marca' };
}

function ProductTabs({ activeKey, counts, onSelect }) {
  return (
    <div role="tablist" aria-label="Vista de productos" className="tabs">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={tab.key === activeKey}
          className={tab.key === activeKey ? 'tab is-on' : 'tab'}
          onClick={() => onSelect(tab.key)}
        >
          {tab.label} ({counts[tab.key]})
        </button>
      ))}
    </div>
  );
}

export function ProductosPage() {
  const catalog = useProducts();
  const panel = useEditPanel({
    create: catalog.createProduct,
    update: catalog.updateProduct,
    remove: catalog.deleteProduct,
    getId: getProductId,
    messages: PANEL_MESSAGES
  });
  const [tabKey, setTabKey] = useState('all');
  const [query, setQuery] = useState('');

  const lowStockProducts = catalog.products.filter(isLowStock);
  const activeTab = TABS.find((tab) => tab.key === tabKey);
  const visibleProducts = catalog.products.filter((product) => activeTab.filter(product) && matchesProduct(product, query));
  const header = panelHeaderFor(panel);

  return (
    <AppShell
      railFooter={
        <>
          <p className="rail__footer-title">Para reponer</p>
          <p className="num">
            {pluralize(lowStockProducts.length, 'producto', 'productos')} con menos de {LOW_STOCK_QUANTITY} u.
          </p>
        </>
      }
    >
      <main className="work">
        <div className="work__header">
          <h1 className="screen-title">Productos y stock</h1>
          <button type="button" className="btn btn--primary" onClick={panel.startCreate}>
            <Icon name="plus" size={14} strokeWidth={2.6} />
            Nuevo producto
          </button>
        </div>

        <div className="tabs-row">
          <ProductTabs
            activeKey={tabKey}
            counts={{ all: catalog.products.length, low: lowStockProducts.length }}
            onSelect={setTabKey}
          />
          <SearchField
            id="filtrar"
            variant="inline"
            label="Filtrar por nombre o marca"
            placeholder="Filtrar por nombre o marca…"
            value={query}
            onChange={setQuery}
          />
        </div>

        {panel.notice && <Notice>{panel.notice}</Notice>}
        {panel.listError && <InlineError>{panel.listError}</InlineError>}

        <ProductsTable
          products={visibleProducts}
          status={catalog.status}
          error={catalog.error}
          onRetry={catalog.reload}
          selectedId={panel.editing?.idProduct}
          onEdit={panel.startEdit}
          onDelete={panel.remove}
          isBusy={panel.isBusy}
          emptyCopy={emptyCopyFor(tabKey, query)}
        />
      </main>

      <aside className="side-column" aria-label={header.title}>
        <PanelHeader title={header.title} subtitle={header.subtitle} />
        {panel.mode === PANEL_MODE.IDLE ? (
          <SupplierOrder lowStockProducts={lowStockProducts} onEdit={panel.startEdit} />
        ) : (
          <ProductForm
            key={panel.editing?.idProduct ?? 'new'}
            product={panel.editing}
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
