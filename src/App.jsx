import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { RequireAuth } from './components/auth/RequireAuth';
import { useAuth } from './hooks/useAuth';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ClientesPage } from './pages/clientes/ClientesPage';
import { CuponesPage } from './pages/cupones/CuponesPage';
import { LoginPage } from './pages/login/LoginPage';
import { MostradorPage } from './pages/mostrador/MostradorPage';
import { PermisosPage } from './pages/permisos/PermisosPage';
import { ProductosPage } from './pages/productos/ProductosPage';
import { RolesPage } from './pages/roles/RolesPage';
import { UsuariosPage } from './pages/usuarios/UsuariosPage';
import { VentasPage } from './pages/ventas/VentasPage';

const NO_SHORTCUTS = {};

export function App() {
  const navigate = useNavigate();
  const { session } = useAuth();

  // The admin screens have no F key: F5, F10 and F11 belong to the browser.
  useKeyboardShortcuts(
    session
      ? {
          F1: () => navigate('/mostrador'),
          F3: () => navigate('/productos'),
          F4: () => navigate('/clientes'),
          F6: () => navigate('/cupones'),
          F7: () => navigate('/ventas')
        }
      : NO_SHORTCUTS
  );

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/mostrador" element={<MostradorPage />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/cupones" element={<CuponesPage />} />
        <Route path="/ventas" element={<VentasPage />} />
        <Route element={<RequireAuth role="ADMIN" />}>
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/permisos" element={<PermisosPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/mostrador" replace />} />
    </Routes>
  );
}
