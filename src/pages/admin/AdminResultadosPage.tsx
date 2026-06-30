import { useState } from 'react';
import { usePartidos, useCargarResultado } from '@/hooks/usePartidos';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';
import { ScoreboardCard } from '@/components/ScoreboardCard';
import type { Partido } from '@/types/domain';

interface ResultadoPendiente {
  partido: Partido;
  golLocal: number;
  golVisitante: number;
}

function FormResultado({
  partido,
  onSolicitarConfirmacion,
}: {
  partido: Partido;
  onSolicitarConfirmacion: (r: ResultadoPendiente) => void;
}) {
  const [golLocal, setGolLocal] = useState(0);
  const [golVisitante, setGolVisitante] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSolicitarConfirmacion({ partido, golLocal, golVisitante });
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
      <button type="submit" className="btn btn-warning btn-sm ms-auto">
        <i className="bi bi-clipboard-check me-1" />
        Cargar resultado
      </button>
    </form>
  );
}

export function AdminResultadosPage() {
  const { data: partidos, isLoading } = usePartidos();
  const cargarResultado = useCargarResultado();

  const [pendiente, setPendiente] = useState<ResultadoPendiente | null>(null);

  const enJuego = (partidos ?? []).filter((p) => p.estadoPartido === 'EN_JUEGO');

  if (isLoading) return <LoadingScreen label="Cargando partidos en juego..." />;

  const confirmarCarga = () => {
    if (!pendiente) return;

    cargarResultado.mutate(
      {
        partidoId: pendiente.partido.id,
        golLocal: pendiente.golLocal,
        golVisitante: pendiente.golVisitante,
      },
      {
        onSuccess: () => setPendiente(null),
      }
    );
  };

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
              <ScoreboardCard
                partido={partido}
                footer={
                  <FormResultado
                    partido={partido}
                    onSolicitarConfirmacion={setPendiente}
                  />
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      {pendiente && (
        <div
          className="modal d-block"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar resultado</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setPendiente(null)}
                />
              </div>
              <div className="modal-body">
                <p className="mb-2">
                  ¿Confirmás cargar el resultado{' '}
                  <strong>
                    {pendiente.golLocal} - {pendiente.golVisitante}
                  </strong>{' '}
                  para{' '}
                  <strong>
                    {pendiente.partido.equipoLocal.nombre} vs{' '}
                    {pendiente.partido.equipoVisitante.nombre}
                  </strong>
                  ?
                </p>
                <p className="small text-secondary mb-0">
                  Esta acción dispara el cálculo de puntos de todos los
                  pronósticos para este partido y no se puede deshacer fácilmente.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setPendiente(null)}
                  disabled={cargarResultado.isPending}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={confirmarCarga}
                  disabled={cargarResultado.isPending}
                >
                  {cargarResultado.isPending ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    'Confirmar carga'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}