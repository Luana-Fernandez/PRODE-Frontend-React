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
import type { Prediccion, EstadoPartido } from '@/types/domain';

/* =======================
   FILTROS PARTIDOS
======================= */
const ESTADOS_PARTIDO: { value: EstadoPartido | 'TODOS'; label: string }[] = [
  { value: 'TODOS', label: 'Todas' },
  { value: 'POR_JUGARSE', label: 'Programados' },
  { value: 'EN_JUEGO', label: 'En juego' },
  { value: 'FINALIZADO', label: 'Finalizados' },
];

export function PartidosPage() {
  const { usuario } = useAuth();

  const [estadoPartidoFiltro, setEstadoPartidoFiltro] =
    useState<EstadoPartido | 'TODOS'>('TODOS');

  const [fechaSeleccionada, setFechaSeleccionada] =
    useState<number | undefined>(undefined);

  const { data: fechas, isLoading: cargandoFechas } = useFechas();

  const { data: partidos, isLoading: cargandoPartidos } =
    usePartidos(fechaSeleccionada);

  const { data: misPredicciones } = usePrediccionesDeUsuario(usuario?.id);

  const partidosFiltrados = useMemo(() => {
    if (!partidos) return [];

    if (estadoPartidoFiltro === 'TODOS') return partidos;

    return partidos.filter(
      (p) => p.estadoPartido === estadoPartidoFiltro
    );
  }, [partidos, estadoPartidoFiltro]);

  const prediccionesPorPartido = useMemo(() => {
    const map = new Map<number, Prediccion>();
    misPredicciones?.forEach((p) => map.set(p.partidoId, p));
    return map;
  }, [misPredicciones]);

  if (cargandoFechas) return <LoadingScreen label="Cargando fechas..." />;

  return (
    <div>
      <h1 className="h3 mb-3">Partidos</h1>

      {/* FILTRO PARTIDOS */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {ESTADOS_PARTIDO.map((opcion) => (
          <button
            key={opcion.value}
            className={`btn btn-sm ${
              estadoPartidoFiltro === opcion.value
                ? 'btn-success'
                : 'btn-outline-secondary'
            }`}
            onClick={() => setEstadoPartidoFiltro(opcion.value)}
          >
            {opcion.label}
          </button>
        ))}
      </div>

      {/* SELECT FECHAS */}
      <select
        className="form-select mb-3"
        value={fechaSeleccionada ?? ''}
        onChange={(e) =>
          setFechaSeleccionada(
            e.target.value ? Number(e.target.value) : undefined
          )
        }
      >
        <option value="">Todas las fechas</option>
        {fechas?.map((f) => (
          <option key={f.id} value={f.id}>
            {f.nombre}
          </option>
        ))}
      </select>

      {/* PARTIDOS */}
      {cargandoPartidos ? (
        <LoadingScreen label="Cargando partidos..." />
      ) : partidosFiltrados.length === 0 ? (
        <EmptyState
          icon="bi-calendar-x"
          title="No hay partidos"
          description="No hay partidos para este filtro"
        />
      ) : (
        <div className="row">
          {partidosFiltrados.map((partido) => {
            const prediccion = prediccionesPorPartido.get(partido.id);

            return (
              <div className="col-12 col-md-6 col-lg-4" key={partido.id}>
                <ScoreboardCard
                  partido={partido}
                  footer={
                    <>
                      <PrediccionForm
                        partido={partido}
                        prediccionExistente={prediccion}
                      />

                      {prediccion && (
                        <div className="d-flex justify-content-between mt-2">
                          <span className="small">
                            {prediccion.golLocal}-{prediccion.golVisitante}
                          </span>
                          <PuntosPill
                            puntos={prediccion.puntosObtenidos}
                            esExacta={prediccion.esExacta}
                          />
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