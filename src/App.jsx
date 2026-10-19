import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ClientesPage } from './pages/clientes/ClientesPage';
import { CuponesPage } from './pages/cupones/CuponesPage';
import { MostradorPage } from './pages/mostrador/MostradorPage';
import { ProductosPage } from './pages/productos/ProductosPage';
import { VentasPage } from './pages/ventas/VentasPage';

export function App() {
  const navigate = useNavigate();

  useKeyboardShortcuts({
    F1: () => navigate('/mostrador'),
    F3: () => navigate('/productos'),
    F4: () => navigate('/clientes'),
    F6: () => navigate('/cupones'),
    F7: () => navigate('/ventas')
  });

  return (
    <Routes>
      <Route path="/mostrador" element={<MostradorPage />} />
      <Route path="/productos" element={<ProductosPage />} />
      <Route path="/clientes" element={<ClientesPage />} />
      <Route path="/cupones" element={<CuponesPage />} />
      <Route path="/ventas" element={<VentasPage />} />
      <Route path="*" element={<Navigate to="/mostrador" replace />} />
    </Routes>
  );
}
