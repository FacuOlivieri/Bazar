import { includesText } from './search';

// `quantity` has no agreed meaning yet (see TODO.md): it is never shown and is sent back untouched.
const DEFAULT_QUANTITY = 1;

export const EMPTY_DRAFT = { name: '', brand: '', price: '', stock: '', quantity: DEFAULT_QUANTITY };

export function matchesProduct(product, query) {
  return includesText([product.name, product.brand], query);
}

export function toDraft(product) {
  return {
    name: product.name,
    brand: product.brand,
    price: String(product.price),
    stock: String(product.stock),
    quantity: product.quantity ?? DEFAULT_QUANTITY
  };
}

// Body for POST /products/create and PUT /products/{id}.
export function toProductRequest(draft) {
  return {
    name: draft.name.trim(),
    brand: draft.brand.trim(),
    price: Number(draft.price),
    stock: Number(draft.stock),
    quantity: draft.quantity
  };
}

export function groupByBrand(products) {
  const groups = new Map();
  products.forEach((product) => {
    const group = groups.get(product.brand) ?? [];
    groups.set(product.brand, [...group, product]);
  });
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'es'))
    .map(([brand, items]) => ({ brand, products: items }));
}

export function indexById(products) {
  return new Map(products.map((product) => [product.idProduct, product]));
}
