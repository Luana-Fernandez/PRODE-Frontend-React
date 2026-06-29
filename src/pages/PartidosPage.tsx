import { useMemo, useState } from 'react';
import { useFechas } from '@/hooks/useFechas';
import { usePartidos } from '@/hooks/usePartidos';
import { usePrediccionesDeUsuario } from '@/hooks/usePredicciones';
import { useAuth } from '@/auth/useAuth';
import { ScoreboardCard } from '@/components/ScoreboardCard';
import { PrediccionForm } from '@/components/PrediccionForm';
import { PuntosPill } from '@/components/PuntosPill';
import { EmptyState } from '@/components/EmptyState';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EstadoFechaBadge } from '@/components/EstadoBadge';
import type { Prediccion } from '@/types/domain';

export function PartidosPage() {
  const { usuario } = useAuth();
  const [fechaSeleccionada, setFechaSeleccionada] = useState<number | undefined>(undefined);

  const { data: fechas, isLoading: cargandoFechas } = useFechas();
  const { data: partidos, isLoading: cargandoPartidos } = usePartidos(fechaSeleccionada);
  const { data: misPredicciones } = usePrediccionesDeUsuario(usuario?.id);

  const prediccionesPorPartido = useMemo(() => {
    const map = new Map<number, Prediccion>();
    misPredicciones?.forEach((p) => map.set(p.partidoId, p));
    return map;
  }, [misPredicciones]);

  if (cargandoFechas) return <LoadingScreen label="Cargando fechas..." />;

  return (
    <div>
      <div className="d-flex align-items-baseline justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <span className="text-eyebrow d-block">Pronósticos</span>
          <h1 className="h3 mb-0">Partidos</h1>
        </div>
      </div>

      <div className="d-flex gap-2 mb-4 flex-wrap">
        <button
          className={`btn btn-sm ${fechaSeleccionada === undefined ? 'btn-success' : 'btn-outline-secondary'}`}
          onClick={() => setFechaSeleccionada(undefined)}
        >
          Todas
        </button>
        {fechas?.map((fecha) => (
          <button
            key={fecha.id}
            className={`btn btn-sm d-flex align-items-center gap-2 ${
              fechaSeleccionada === fecha.id ? 'btn-success' : 'btn-outline-secondary'
            }`}
            onClick={() => setFechaSeleccionada(fecha.id)}
          >
            {fecha.nombre}
            <EstadoFechaBadge estado={fecha.estado} />
          </button>
        ))}
      </div>

      {cargandoPartidos ? (
        <LoadingScreen label="Cargando partidos..." />
      ) : !partidos || partidos.length === 0 ? (
        <EmptyState
          icon="bi-calendar-x"
          title="No hay partidos para mostrar"
          description="Probá con otra fecha o esperá a que el administrador cargue el fixture."
        />
      ) : (
        <div className="row">
          {partidos.map((partido) => {
            const prediccionPropia = prediccionesPorPartido.get(partido.id);
            return (
              <div className="col-12 col-md-6 col-lg-4" key={partido.id}>
                <ScoreboardCard
                  partido={partido}
                  footer={
                    <>
                      <PrediccionForm partido={partido} prediccionExistente={prediccionPropia} />
                      {prediccionPropia && (
                        <div className="d-flex align-items-center justify-content-between mt-2">
                          <span className="font-mono small text-light opacity-50">
                            Tu pronóstico: {prediccionPropia.golLocal}-{prediccionPropia.golVisitante}
                          </span>
                          <PuntosPill puntos={prediccionPropia.puntosObtenidos} esExacta={prediccionPropia.esExacta} />
                        </div>
                      )}
                    </>
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
