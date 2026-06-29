import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import type { Rol } from '@/types/auth';
import { LoadingScreen } from '@/components/LoadingScreen';

interface ProtectedRouteProps {
  rolesPermitidos?: Rol[];
}

export function ProtectedRoute({ rolesPermitidos }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, usuario } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
