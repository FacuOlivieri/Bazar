import { useCallback, useState } from 'react';
import { salesApi } from '../../api/salesApi';
import { clientFullName } from '../../domain/client';
import { buildSaleRequest } from '../../domain/sale';

const COUPON_USED = /ya fue usado/i;
const COUPON_MISSING = /coupon not found/i;

function describeChargeError(error) {
  if (error.status === 0) return error.message;
  if (COUPON_USED.test(error.message)) return `${error.message}. Quitá el cupón o probá con otro.`;
  if (COUPON_MISSING.test(error.message)) return 'Ese cupón ya no existe. Quitalo para poder cobrar.';
  if (error.status === 400 || error.status === 409) return error.message;
  return 'No se pudo registrar la venta. Puede que no alcance el stock de algún producto: revisá las cantidades y probá de nuevo.';
}

// Sends the ticket to POST /sales/create and reports the outcome. The total comes back
// from the backend already discounted when the sale carries a coupon.
export function useCharge({ onCharged }) {
  const [isCharging, setIsCharging] = useState(false);
  const [error, setError] = useState(null);
  const [lastSale, setLastSale] = useState(null);

  const charge = useCallback(
    async (client, lines, coupon) => {
      setIsCharging(true);
      setError(null);
      try {
        const sale = await salesApi.create(buildSaleRequest(client.idClientDTO, lines, coupon));
        setLastSale({
          id: sale.id,
          totalPrice: sale.totalPrice,
          clientName: clientFullName(client),
          couponIdentifier: sale.coupon?.identifier ?? null,
          couponDiscount: sale.coupon?.discount ?? null
        });
        onCharged();
      } catch (chargeError) {
        setError(describeChargeError(chargeError));
      } finally {
        setIsCharging(false);
      }
    },
    [onCharged]
  );

  const dismiss = useCallback(() => {
    setError(null);
    setLastSale(null);
  }, []);

  return { charge, isCharging, error, lastSale, dismiss };
}
