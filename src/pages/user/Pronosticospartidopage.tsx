import { useParams, useNavigate } from 'react-router-dom';
import { usePrediccionesDePartido } from '@/hooks/usePredicciones';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';
import { PuntosPill } from '@/components/PuntosPill';
import { EstadoPartidoBadge } from '@/components/EstadoBadge';
import { useAuth } from '@/auth/useAuth';

export function PronosticosPartidoPage() {
  const { partidoId } = useParams<{ partidoId: string }>();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { data: predicciones, isLoading } = usePrediccionesDePartido(
    partidoId ? Number(partidoId) : undefined
  );

  if (isLoading) return <LoadingScreen label="Cargando pronósticos..." />;

  return (
    <div>
      <button
        type="button"
        className="btn btn-link px-0 mb-3 text-secondary"
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left me-1" />
        Volver
      </button>

      <span className="text-eyebrow d-block">Partido #{partidoId}</span>
      <h1 className="h3 mb-4">Pronósticos del partido</h1>

      {!predicciones || predicciones.length === 0 ? (
        <EmptyState
          icon="bi-clipboard-x"
          title="No hay pronósticos disponibles"
          description="Todavía no hay pronósticos para este partido, o el periodo de bloqueo aún no expiró."
        />
      ) : (
        <div className="card card-soft">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr className="text-eyebrow border-bottom">
                  <th>Usuario</th>
                  <th>Pronóstico</th>
                  <th>Estado</th>
                  <th className="text-end">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {predicciones.map((p) => {
                  const esPropio = p.nombreUsuario === usuario?.nombreUsuario;
                  return (
                    <tr key={p.id} className={esPropio ? 'fila-ranking-propia' : ''}>
                      <td className="fw-semibold">
                        {p.nombreUsuario}
                        {esPropio && (
                          <span className="badge bg-warning text-dark ms-2">Vos</span>
                        )}
                      </td>
                      <td className="font-mono">
                        {p.golLocal} - {p.golVisitante}
                      </td>
                      <td>
                        <EstadoPartidoBadge estado={p.estadoPartido} />
                      </td>
                      <td className="text-end">
                        <PuntosPill puntos={p.puntosObtenidos} esExacta={p.esExacta} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}