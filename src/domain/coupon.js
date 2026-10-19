// Mirrors CouponService: discount is a percentage, greater than 0 and up to 100.
export const MAX_DISCOUNT = 100;

export const EMPTY_COUPON_DRAFT = { identifier: '', discount: '', used: false };

const discountFormatter = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 });

// Codes are dictated at the counter: uppercase, no spaces ("dia del padre" → "DIADELPADRE").
export function normalizeIdentifier(text) {
  return String(text ?? '').replace(/\s+/g, '').toUpperCase();
}

// 15 → "15 %"
export function formatDiscount(discount) {
  return `${discountFormatter.format(Number(discount) || 0)} %`;
}

// Same math as Calculator.applyDiscount in the backend, rounded to cents.
export function applyDiscount(total, discount) {
  const discounted = total * (1 - discount / 100);
  return Math.round(discounted * 100) / 100;
}

export function discountAmount(total, coupon) {
  return coupon ? total - applyDiscount(total, coupon.discount) : 0;
}

// Coupon codes are typed by hand at the counter: compare ignoring case and spaces.
export function findCouponByIdentifier(coupons, identifier) {
  const wanted = normalizeIdentifier(identifier);
  return coupons.find((coupon) => normalizeIdentifier(coupon.identifier) === wanted) ?? null;
}

export function matchesCoupon(coupon, query) {
  return normalizeIdentifier(coupon.identifier).includes(normalizeIdentifier(query));
}

export function toCouponDraft(coupon) {
  return { identifier: coupon.identifier, discount: String(coupon.discount), used: Boolean(coupon.used) };
}

// Body for POST /coupons/create and PUT /coupons/{id}.
export function toCouponRequest(draft) {
  return { identifier: normalizeIdentifier(draft.identifier), discount: Number(draft.discount), used: Boolean(draft.used) };
}

export function sortCoupons(coupons) {
  return [...coupons].sort((a, b) => Number(a.used) - Number(b.used) || a.identifier.localeCompare(b.identifier, 'es'));
}
