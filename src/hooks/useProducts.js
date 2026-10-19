import { useCallback, useMemo } from 'react';
import { productsApi } from '../api/productsApi';
import { indexById } from '../domain/product';
import { useResource } from './useResource';

const NO_PRODUCTS = [];

export function useProducts() {
  const { data, status, error, reload } = useResource(productsApi.getAll);
  const products = data ?? NO_PRODUCTS;
  const productsById = useMemo(() => indexById(products), [products]);

  const createProduct = useCallback(
    async (request) => {
      const created = await productsApi.create(request);
      await reload();
      return created;
    },
    [reload]
  );

  const updateProduct = useCallback(
    async (idProduct, request) => {
      const updated = await productsApi.update(idProduct, request);
      await reload();
      return updated;
    },
    [reload]
  );

  const deleteProduct = useCallback(
    async (idProduct) => {
      await productsApi.remove(idProduct);
      await reload();
    },
    [reload]
  );

  return { products, productsById, status, error, reload, createProduct, updateProduct, deleteProduct };
}
