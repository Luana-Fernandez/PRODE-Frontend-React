import type { ReactNode } from 'react';
import type { Partido } from '@/types/domain';
import { EstadoPartidoBadge } from './EstadoBadge';
import { formatFechaHora } from '@/utils/datetime';

interface ScoreboardCardProps {
  partido: Partido;
  children?: ReactNode;
  footer?: ReactNode;
}

export function ScoreboardCard({ partido, children, footer }: ScoreboardCardProps) {
  const hayResultado = partido.golLocal !== null && partido.golVisitante !== null;

  return (
    <div className="scoreboard-card mb-3">
      <div className="scoreboard-header">
        <span>{formatFechaHora(partido.horaInicio)}</span>
        <EstadoPartidoBadge estado={partido.estadoPartido} />
      </div>

      <div className="scoreboard-body">
        <div className="scoreboard-team">
          <span className="team-name">{partido.equipoLocal.nombre}</span>
        </div>

        <div className="d-flex align-items-center">
          <span className="scoreboard-score">{hayResultado ? partido.golLocal : '–'}</span>
          <span className="scoreboard-score-sep">:</span>
          <span className="scoreboard-score">{hayResultado ? partido.golVisitante : '–'}</span>
        </div>

        <div className="scoreboard-team">
          <span className="team-name">{partido.equipoVisitante.nombre}</span>
        </div>
      </div>

      {children && <div className="px-3 pb-3 position-relative" style={{ zIndex: 1 }}>{children}</div>}
      {footer && (
        <div className="px-3 pb-3 pt-1 position-relative border-top border-light border-opacity-10" style={{ zIndex: 1 }}>
          {footer}
        </div>
      )}
    </div>
  );
}
