import { useRankingGlobal } from '@/hooks/useRanking';
import { useAuth } from '@/auth/useAuth';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';

function claseDelPuesto(posicion: number) {
  if (posicion === 1) return 'puesto-1';
  if (posicion === 2) return 'puesto-2';
  if (posicion === 3) return 'puesto-3';
  return 'puesto-otro';
}

export function RankingPage() {
  const { usuario } = useAuth();
  const { data: ranking, isLoading } = useRankingGlobal();

  if (isLoading) return <LoadingScreen label="Calculando posiciones..." />;

  return (
    <div>
      <span className="text-eyebrow d-block">Tabla general</span>
      <h1 className="h3 mb-4">Ranking global</h1>

      {!ranking || ranking.length === 0 ? (
        <EmptyState icon="bi-bar-chart-line" title="Todavía no hay puntos cargados" />
      ) : (
        <div className="card card-soft">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr className="text-eyebrow border-bottom">
                  <th style={{ width: '4rem' }}>#</th>
                  <th>Usuario</th>
                  <th className="text-end">Exactos</th>
                  <th className="text-end">Puntos</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((item, idx) => {
                  const posicion = item.posicion ?? idx + 1;
                  const esPropio = item.usuarioId === usuario?.id;
                  return (
                    <tr key={item.usuarioId} className={esPropio ? 'fila-ranking-propia' : ''}>
                      <td>
                        <span className={`podio-puesto ${claseDelPuesto(posicion)}`}>{posicion}</span>
                      </td>
                      <td className="fw-semibold">
                        {item.usuarioNombre}
                        {esPropio && <span className="badge bg-warning text-dark ms-2">Vos</span>}
                      </td>
                      <td className="text-end font-mono">{item.exactas}</td>
                      <td className="text-end font-mono fw-bold fs-5">{item.puntos}</td>
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