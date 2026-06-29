import { useAuth } from '@/auth/useAuth';
import { usePrediccionesDeUsuario } from '@/hooks/usePredicciones';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';
import { PuntosPill } from '@/components/PuntosPill';
import { EstadoPartidoBadge } from '@/components/EstadoBadge';

export function MisPronosticosPage() {
  const { usuario } = useAuth();
  const { data: predicciones, isLoading } = usePrediccionesDeUsuario(usuario?.id);

  if (isLoading) return <LoadingScreen label="Cargando tus pronósticos..." />;

  const totalPuntos = predicciones?.reduce((acc, p) => acc + (p.puntosObtenidos ?? 0), 0) ?? 0;
  const exactos = predicciones?.filter((p) => p.esExacta).length ?? 0;

  return (
    <div>
      <span className="text-eyebrow d-block">Tu historial</span>
      <h1 className="h3 mb-4">Mis pronósticos</h1>

      <div className="row mb-4 g-3">
        <div className="col-6 col-md-3">
          <div className="card card-soft p-3 text-center">
            <span className="font-mono fs-3 fw-bold text-success">{totalPuntos}</span>
            <span className="small text-secondary">Puntos totales</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card card-soft p-3 text-center">
            <span className="font-mono fs-3 fw-bold text-dorado">{exactos}</span>
            <span className="small text-secondary">Resultados exactos</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card card-soft p-3 text-center">
            <span className="font-mono fs-3 fw-bold">{predicciones?.length ?? 0}</span>
            <span className="small text-secondary">Pronósticos hechos</span>
          </div>
        </div>
      </div>

      {!predicciones || predicciones.length === 0 ? (
        <EmptyState
          icon="bi-clipboard-x"
          title="Todavía no hiciste ningún pronóstico"
          description="Andá a la pestaña de Partidos para empezar a pronosticar."
        />
      ) : (
        <div className="card card-soft">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr className="text-eyebrow border-bottom">
                  <th>Partido</th>
                  <th>Tu pronóstico</th>
                  <th>Estado</th>
                  <th className="text-end">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {predicciones.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className="font-mono small text-secondary">Partido #{p.partidoId}</span>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}