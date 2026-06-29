import type { EstadoFecha, EstadoPartido } from '@/types/domain';

const PARTIDO_LABEL: Record<EstadoPartido, string> = {
  POR_JUGARSE: 'Por jugarse',
  EN_JUEGO: 'En juego',
  FINALIZADO: 'Finalizado',
};

const PARTIDO_CLASS: Record<EstadoPartido, string> = {
  POR_JUGARSE: 'por-jugarse',
  EN_JUEGO: 'en-juego',
  FINALIZADO: 'finalizado',
};

const PARTIDO_DOT: Record<EstadoPartido, string> = {
  POR_JUGARSE: 'is-scheduled',
  EN_JUEGO: 'is-live',
  FINALIZADO: 'is-finished',
};

export function EstadoPartidoBadge({ estado }: { estado: EstadoPartido }) {
  return (
    <span className={`badge-estado ${PARTIDO_CLASS[estado]} d-inline-flex align-items-center`}>
      <span className={`status-dot ${PARTIDO_DOT[estado]}`} />
      {PARTIDO_LABEL[estado]}
    </span>
  );
}

const FECHA_LABEL: Record<EstadoFecha, string> = {
  PROGRAMADA: 'Programada',
  EN_JUEGO: 'En juego',
  FINALIZADA: 'Finalizada',
};

const FECHA_CLASS: Record<EstadoFecha, string> = {
  PROGRAMADA: 'programada',
  EN_JUEGO: 'en-juego',
  FINALIZADA: 'finalizada',
};

export function EstadoFechaBadge({ estado }: { estado: EstadoFecha }) {
  return <span className={`badge-estado ${FECHA_CLASS[estado]}`}>{FECHA_LABEL[estado]}</span>;
}
