import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ClientesPage } from './pages/clientes/ClientesPage';
import { MostradorPage } from './pages/mostrador/MostradorPage';
import { ProductosPage } from './pages/productos/ProductosPage';

export function App() {
  const navigate = useNavigate();

  useKeyboardShortcuts({
    F1: () => navigate('/mostrador'),
    F3: () => navigate('/productos'),
    F4: () => navigate('/clientes')
  });

  return (
    <Routes>
      <Route path="/mostrador" element={<MostradorPage />} />
      <Route path="/productos" element={<ProductosPage />} />
      <Route path="/clientes" element={<ClientesPage />} />
      <Route path="*" element={<Navigate to="/mostrador" replace />} />
    </Routes>
  );
}
