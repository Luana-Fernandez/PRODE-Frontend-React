import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/auth/AuthContext';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { AppLayout } from '@/components/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { HomePage } from '@/pages/HomePage';
import { PartidosPage } from '@/pages/user/PartidosPage';
import { RankingPage } from '@/pages/RankingPage';
import { GruposPage } from '@/pages/GruposPage';
import { MisPronosticosPage } from '@/pages/user/MisPronosticosPage';
import { PerfilPage } from '@/pages/user/PerfilPage';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminEquiposPage } from '@/pages/admin/AdminEquiposPage';
import { AdminFechasPage } from '@/pages/admin/AdminFechasPage';
import { AdminPartidosPage } from '@/pages/admin/AdminPartidosPage';
import { AdminResultadosPage } from '@/pages/admin/AdminResultadosPage';
import { AdminPronosticosPage } from './pages/admin/AdminPronosticosPage';
import { AdminUsuariosPage } from './pages/admin/AdminUsuariosPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas autenticadas (cualquier rol) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/partidos" element={<PartidosPage />} />
              <Route path="/ranking" element={<RankingPage />} />
              <Route path="/grupos" element={<GruposPage />} />
              <Route path="/mis-pronosticos" element={<MisPronosticosPage />} />
              <Route path="/perfil" element={<PerfilPage />} />

              {/* Rutas solo ADMIN */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="equipos" replace />} />
                <Route path="equipos" element={<AdminEquiposPage />} />
                <Route path="fechas" element={<AdminFechasPage />} />
                <Route path="partidos" element={<AdminPartidosPage />} />
                <Route path="resultados" element={<AdminResultadosPage />} />
                <Route path="pronosticos" element={<AdminPronosticosPage />} />
                <Route path="usuarios" element={<AdminUsuariosPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}