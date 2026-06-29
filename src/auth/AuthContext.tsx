import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '@/api/auth';
import { tokenStorage } from '@/api/client';
import type { JwtPayload, LoginRequest, RegisterRequest, Usuario } from '@/types/auth';

interface AuthContextValue {
  usuario: Usuario | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function isTokenValid(token: string): boolean {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const cargarUsuarioActual = useCallback(async () => {
    const token = tokenStorage.get();
    if (!token || !isTokenValid(token)) {
      tokenStorage.clear();
      setUsuario(null);
      setIsLoading(false);
      return;
    }
    try {
      const data = await authApi.me();
      setUsuario(data);
    } catch {
      tokenStorage.clear();
      setUsuario(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarUsuarioActual();
  }, [cargarUsuarioActual]);

  const login = useCallback(async (data: LoginRequest) => {
    const { token } = await authApi.login(data);
    tokenStorage.set(token);
    const me = await authApi.me();
    setUsuario(me);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    await authApi.register(data);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUsuario(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      usuario,
      isLoading,
      isAuthenticated: usuario !== null,
      login,
      register,
      logout,
    }),
    [usuario, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
