import { useCallback, useEffect, useState } from 'react';

export const LOAD_STATUS = { LOADING: 'loading', READY: 'ready', ERROR: 'error' };

// Loads data once with a stable `loader` and exposes `reload` for later refreshes.
export function useResource(loader) {
  const [state, setState] = useState({ data: null, status: LOAD_STATUS.LOADING, error: null });

  const reload = useCallback(async () => {
    setState((previous) => ({ ...previous, error: null }));
    try {
      const data = await loader();
      setState({ data, status: LOAD_STATUS.READY, error: null });
    } catch (error) {
      setState((previous) => ({ ...previous, status: LOAD_STATUS.ERROR, error }));
    }
  }, [loader]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...state, reload };
}
