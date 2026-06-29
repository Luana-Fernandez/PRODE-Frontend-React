import { useState } from 'react';
import { usePartidos, useCargarResultado } from '@/hooks/usePartidos';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';
import { ScoreboardCard } from '@/components/ScoreboardCard';
import type { Partido } from '@/types/domain';

function FormResultado({ partido }: { partido: Partido }) {
  const [golLocal, setGolLocal] = useState(0);
  const [golVisitante, setGolVisitante] = useState(0);
  const cargarResultado = useCargarResultado();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(`Confirmar resultado: ${partido.equipoLocal.nombre} ${golLocal} - ${golVisitante} ${partido.equipoVisitante.nombre}. Esto calculará los puntos de todos los usuarios.`)) {
      return;
    }
    cargarResultado.mutate(
      { idPartido: partido.id, golLocal, golVisitante },
      {
        onSuccess: () => { setGolLocal(0); setGolVisitante(0); },
        onError: () => setTimeout(() => { setGolLocal(0); setGolVisitante(0); }, 1500),
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex align-items-center gap-3 flex-wrap">
      <div className="d-flex align-items-center gap-2">
        <input
          type="number"
          min={0}
          className="form-control form-control-sm text-center font-mono"
          style={{ width: '4.5rem' }}
          value={golLocal}
          onChange={(e) => setGolLocal(Math.max(0, Number(e.target.value)))}
        />
        <span className="text-light opacity-50">–</span>
        <input
          type="number"
          min={0}
          className="form-control form-control-sm text-center font-mono"
          style={{ width: '4.5rem' }}
          value={golVisitante}
          onChange={(e) => setGolVisitante(Math.max(0, Number(e.target.value)))}
        />
      </div>
      <button type="submit" className="btn btn-warning btn-sm ms-auto" disabled={cargarResultado.isPending}>
        {cargarResultado.isPending ? (
          <span className="spinner-border spinner-border-sm" />
        ) : (
          <>
            <i className="bi bi-clipboard-check me-1" />
            Cargar resultado
          </>
        )}
      </button>
    </form>
  );
}

export function AdminResultadosPage() {
  const { data: partidos, isLoading } = usePartidos();

  const enJuego = (partidos ?? []).filter((p) => p.estadoPartido === 'EN_JUEGO');

  if (isLoading) return <LoadingScreen label="Cargando partidos en juego..." />;

  return (
    <div>
      <p className="text-secondary small mb-4">
        Solo se pueden cargar resultados de partidos cuya fecha esté <strong>EN_JUEGO</strong>.
        Al confirmar, se dispara el motor de puntuación para todos los pronósticos.
      </p>

      {enJuego.length === 0 ? (
        <EmptyState
          icon="bi-clipboard-check"
          title="No hay partidos en juego"
          description="Marcá un partido como 'En juego' desde la pestaña Partidos para poder cargar su resultado."
        />
      ) : (
        <div className="row">
          {enJuego.map((partido) => (
            <div className="col-12 col-md-6 col-lg-4" key={partido.id}>
              <ScoreboardCard partido={partido} footer={<FormResultado partido={partido} />} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
