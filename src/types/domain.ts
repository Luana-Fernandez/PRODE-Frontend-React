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

// ---------- Equipos ----------
export interface Equipo {
  id: number;
  nombre: string;
  eliminado: boolean;
  escudoUrl?: string | null;
}

export interface EquipoCreateRequest {
  nombre: string;
}

export interface EquipoUpdateRequest {
  nombre: string;
}

// ---------- Fechas ----------
export type EstadoFecha = 'PROGRAMADA' | 'EN_JUEGO' | 'FINALIZADA';

export interface Fecha {
  id: number;
  nombre: string;
  estado: EstadoFecha;
}

export interface FechaCreateRequest {
  nombre: string;
}

export interface FechaUpdateRequest {
  nombre: string;
}

// ---------- Partidos ----------
export type EstadoPartido = 'POR_JUGARSE' | 'EN_JUEGO' | 'FINALIZADO';

export interface Partido {
  id: number;
  equipoLocal: Equipo;
  equipoVisitante: Equipo;
  golLocal: number | null;
  golVisitante: number | null;
  estadoPartido: EstadoPartido;
  resultado: string | null;
  fechaId: number;
  horaInicio: string; // ISO 8601 UTC
}

export interface PartidoCreateRequest {
  equipoLocalId: number;
  equipoVisitanteId: number;
  fechaId: number;
  horaInicio: string; // ISO 8601
}

export interface PartidoUpdateRequest {
  equipoLocalId?: number;
  equipoVisitanteId?: number;
  fechaId?: number;
  horaInicio?: string;
  estadoPartido?: EstadoPartido;
}

export interface PartidoResultadoRequest {
  partidoId: number;
  golLocal: number;
  golVisitante: number;
}

// ---------- Predicciones (Pronósticos) ----------
export interface Prediccion {
  id: number;
  nombreUsuario: string;
  partidoId: number;
  estadoPartido: EstadoPartido;
  golLocal: number;
  golVisitante: number;
  puntosObtenidos: number | null;
  esTendencia: boolean;
  esExacta: boolean;
  fechaPrediccion: string;
}

export interface PrediccionCreateRequest {
  partidoId: number;
  golLocal: number;
  golVisitante: number;
}

// ---------- Ranking ----------
// Alineado exactamente con RankingResponseDTO del backend
export interface RankingItem {
  usuarioId: number;
  usuarioNombre: string;
  puntos: number;
  exactas: number;
  posicion?: number;
}

// ---------- Grupos ----------
export interface Grupo {
  id: number;
  nombre: string;
  codigoInvitacion: string;
  activo: boolean;
}

export interface GrupoCreateRequest {
  nombre: string;
}

export interface GrupoUpdateRequest {
  nombre: string;
}

export interface GrupoUnirseRequest {
  codigoInvitacion: string;
}

// ---------- Errores de API ----------
export interface ApiErrorBody {
  error: string;
  message: string;
  status: number;
  timestamp: number;
}