import { useCallback, useMemo, useState } from 'react';
import { countUnits, ticketTotal } from '../domain/sale';

// Lines of the sale being built: [{ idProduct, quantity }]. Never exceeds the product's stock.
export function useTicket(productsById) {
  const [lines, setLines] = useState([]);

  const quantityOf = useCallback(
    (idProduct) => lines.find((line) => line.idProduct === idProduct)?.quantity ?? 0,
    [lines]
  );

  const canAdd = useCallback((product) => quantityOf(product.idProduct) < product.stock, [quantityOf]);

  const add = useCallback(
    (product) => {
      if (!canAdd(product)) return;
      setLines((current) => {
        const exists = current.some((line) => line.idProduct === product.idProduct);
        return exists
          ? current.map((line) => (line.idProduct === product.idProduct ? { ...line, quantity: line.quantity + 1 } : line))
          : [...current, { idProduct: product.idProduct, quantity: 1 }];
      });
    },
    [canAdd]
  );

  const changeQuantity = useCallback(
    (idProduct, delta) => {
      const stock = productsById.get(idProduct)?.stock ?? 0;
      setLines((current) =>
        current
          .map((line) => (line.idProduct === idProduct ? { ...line, quantity: Math.min(line.quantity + delta, stock) } : line))
          .filter((line) => line.quantity > 0)
      );
    },
    [productsById]
  );

  const remove = useCallback((idProduct) => {
    setLines((current) => current.filter((line) => line.idProduct !== idProduct));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const total = useMemo(() => ticketTotal(lines, productsById), [lines, productsById]);
  const units = useMemo(() => countUnits(lines), [lines]);

  return { lines, total, units, isEmpty: lines.length === 0, quantityOf, canAdd, add, changeQuantity, remove, clear };
}
