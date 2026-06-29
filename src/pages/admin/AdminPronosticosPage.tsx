import { useState } from 'react';
import { usePredicciones } from '@/hooks/usePredicciones';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';
import { PuntosPill } from '@/components/PuntosPill';
import { EstadoPartidoBadge } from '@/components/EstadoBadge';
import type { EstadoPartido } from '@/types/domain';

const ESTADOS: { value: EstadoPartido | undefined; label: string }[] = [
  { value: undefined, label: 'Todos' },
  { value: 'POR_JUGARSE', label: 'Por jugarse' },
  { value: 'EN_JUEGO', label: 'En juego' },
  { value: 'FINALIZADO', label: 'Finalizados' },
];

export function AdminPronosticosPage() {
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoPartido | undefined>(undefined);
  const { data: predicciones, isLoading } = usePredicciones(estadoFiltro);

  if (isLoading) return <LoadingScreen label="Cargando pronósticos..." />;

  return (
    <div>
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {ESTADOS.map((op) => (
          <button
            key={op.label}
            className={`btn btn-sm ${estadoFiltro === op.value ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => setEstadoFiltro(op.value)}
          >
            {op.label}
          </button>
        ))}
      </div>

      {!predicciones || predicciones.length === 0 ? (
        <EmptyState
          icon="bi-clipboard-x"
          title="No hay pronósticos"
          description="No se encontraron pronósticos para el filtro seleccionado."
        />
      ) : (
        <div className="card card-soft">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr className="text-eyebrow border-bottom">
                  <th>Usuario</th>
                  <th>Partido</th>
                  <th>Pronóstico</th>
                  <th>Estado</th>
                  <th className="text-end">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {predicciones.map((p) => (
                  <tr key={p.id}>
                    <td className="fw-semibold">{p.nombreUsuario}</td>
                    <td>
                      <span className="font-mono small text-secondary">Partido #{p.partidoId}</span>
                    </td>
                    <td className="font-mono">{p.golLocal} - {p.golVisitante}</td>
                    <td><EstadoPartidoBadge estado={p.estadoPartido} /></td>
                    <td className="text-end">
                      <PuntosPill puntos={p.puntosObtenidos} esExacta={p.esExacta} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}