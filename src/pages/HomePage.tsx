import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { usePartidos } from '@/hooks/usePartidos';
import { ScoreboardCard } from '@/components/ScoreboardCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';

export function HomePage() {
  const { usuario } = useAuth();
  const { data: partidos, isLoading } = usePartidos();

  const proximos = (partidos ?? [])
    .filter((p) => p.estadoPartido !== 'FINALIZADO')
    .sort((a, b) => new Date(a.horaInicio).getTime() - new Date(b.horaInicio).getTime())
    .slice(0, 3);

  return (
    <div>
      <div className="mb-4">
        <span className="text-eyebrow d-block">Bienvenido/a</span>
        <h1 className="h3 mb-1">Hola, {usuario?.nombreUsuario} 👋</h1>
        <p className="text-secondary mb-0">Estos son los próximos partidos para pronosticar.</p>
      </div>

      {isLoading ? (
        <LoadingScreen label="Cargando próximos partidos..." />
      ) : proximos.length === 0 ? (
        <EmptyState
          icon="bi-calendar2-week"
          title="No hay partidos próximos"
          description="Cuando se cargue el fixture vas a poder pronosticar acá."
        />
      ) : (
        <div className="row">
          {proximos.map((partido) => (
            <div className="col-12 col-md-6 col-lg-4" key={partido.id}>
              <ScoreboardCard partido={partido} />
            </div>
          ))}
        </div>
      )}

      <div className="d-flex gap-2 mt-4 flex-wrap">
        <Link to="/partidos" className="btn btn-success">
          <i className="bi bi-joystick me-2" />
          Ver todos los partidos
        </Link>
        <Link to="/ranking" className="btn btn-outline-secondary">
          <i className="bi bi-bar-chart-line me-2" />
          Ver ranking
        </Link>
      </div>
    </div>
  );
}
