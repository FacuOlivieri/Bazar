import { useEffect, useRef } from 'react';

// Binds keys like { F2: focusSearch, F12: charge }. Handlers always see the latest render.
export function useKeyboardShortcuts(shortcuts) {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    function handleKeyDown(event) {
      const handler = shortcutsRef.current[event.key];
      if (!handler) return;
      event.preventDefault();
      handler();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
