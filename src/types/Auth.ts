export type Rol = 'USER' | 'ADMIN';

export interface Usuario {
  id: number;
  nombreUsuario: string;
  email: string;
  rol: Rol;
  idGrupoPropio?: number | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombreUsuario: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

/** Payload decodificado del JWT (lo mínimo que necesitamos en el cliente). */
export interface JwtPayload {
  sub: string;
  rol: Rol;
  id?: number;
  exp: number;
  iat: number;
}
