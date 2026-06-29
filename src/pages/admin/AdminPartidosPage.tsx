import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useEquipos } from '@/hooks/useEquipos';
import { useFechas } from '@/hooks/useFechas';
import { useCrearPartido, useEliminarPartido, usePartidos, useActualizarPartido } from '@/hooks/usePartidos';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';
import { EstadoPartidoBadge } from '@/components/EstadoBadge';
import { formatFechaHora, isoUtcToLocalInput, localInputToIsoUtc } from '@/utils/datetime';
import type { Partido, PartidoCreateRequest } from '@/types/domain';

interface PartidoFormValues {
  fechaId: number;
  equipoLocalId: number;
  equipoVisitanteId: number;
  horaInicioLocal: string;
}

export function AdminPartidosPage() {
  const { data: equipos } = useEquipos();
  const { data: fechas } = useFechas();
  const [fechaFiltro, setFechaFiltro] = useState<number | undefined>(undefined);
  const { data: partidos, isLoading } = usePartidos(fechaFiltro);

  const crearPartido = useCrearPartido();
  const actualizarPartido = useActualizarPartido();
  const eliminarPartido = useEliminarPartido();

  const [editando, setEditando] = useState<Partido | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartidoFormValues>();

  const equiposActivos = (equipos ?? []).filter((e) => !e.eliminado);

  const fechasDisponibles = (fechas ?? []).filter(
    (f) => f.estado === 'PROGRAMADA' || f.estado === 'EN_JUEGO'
  );

  const resetForm = () => {
    reset({
      fechaId: '' as any,
      equipoLocalId: '' as any,
      equipoVisitanteId: '' as any,
      horaInicioLocal: '',
    });
  };

  const onSubmit = (data: PartidoFormValues) => {
    const payload: PartidoCreateRequest = {
      fechaId: Number(data.fechaId),
      equipoLocalId: Number(data.equipoLocalId),
      equipoVisitanteId: Number(data.equipoVisitanteId),
      horaInicio: localInputToIsoUtc(data.horaInicioLocal),
    };

    if (payload.equipoLocalId === payload.equipoVisitanteId) {
      alert('El equipo local y visitante no pueden ser el mismo.');
      return;
    }

    if (editando) {
      actualizarPartido.mutate(
        { id: editando.id, data: payload },
        {
          onSuccess: () => { setEditando(null); resetForm(); },
          onError: () => setTimeout(() => { setEditando(null); resetForm(); }, 1500),
        }
      );
    } else {
      crearPartido.mutate(payload, { onSuccess: () => resetForm() });
    }
  };

  const empezarEdicion = (partido: Partido) => {
    setEditando(partido);
    reset({
      fechaId: partido.fechaId,
      equipoLocalId: partido.equipoLocal.id,
      equipoVisitanteId: partido.equipoVisitante.id,
      horaInicioLocal: isoUtcToLocalInput(partido.horaInicio),
    });
  };

  const cancelarEdicion = () => {
    setEditando(null);
    resetForm();
  };

  const marcarEnJuego = (partido: Partido) => {
    actualizarPartido.mutate({ id: partido.id, data: { estadoPartido: 'EN_JUEGO' } });
  };

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-4">
        <div className="card card-soft">
          <div className="card-body">
            <h5 className="mb-3">{editando ? 'Editar partido' : 'Nuevo partido'}</h5>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Fecha / jornada</label>
                <select
                  className={`form-select ${errors.fechaId ? 'is-invalid' : ''}`}
                  {...register('fechaId', { required: 'Elegí una fecha' })}
                >
                  <option value="">Seleccioná una fecha...</option>
                  {fechasDisponibles.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nombre} — {f.estado === 'PROGRAMADA' ? 'Programada' : 'En juego'}
                    </option>
                  ))}
                </select>
                {errors.fechaId && <div className="invalid-feedback">{errors.fechaId.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Equipo local</label>
                <select
                  className={`form-select ${errors.equipoLocalId ? 'is-invalid' : ''}`}
                  {...register('equipoLocalId', { required: 'Elegí el equipo local' })}
                >
                  <option value="">Seleccioná...</option>
                  {equiposActivos.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Equipo visitante</label>
                <select
                  className={`form-select ${errors.equipoVisitanteId ? 'is-invalid' : ''}`}
                  {...register('equipoVisitanteId', { required: 'Elegí el equipo visitante' })}
                >
                  <option value="">Seleccioná...</option>
                  {equiposActivos.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Hora de inicio</label>
                <input
                  type="datetime-local"
                  className={`form-control ${errors.horaInicioLocal ? 'is-invalid' : ''}`}
                  {...register('horaInicioLocal', { required: 'Indicá la hora de inicio' })}
                />
                <div className="form-text">Se guarda automáticamente en UTC.</div>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={crearPartido.isPending || actualizarPartido.isPending}
                >
                  {editando ? 'Guardar cambios' : 'Crear partido'}
                </button>
                {editando && (
                  <button type="button" className="btn btn-outline-secondary" onClick={cancelarEdicion}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-8">
        <div className="d-flex gap-3 mb-3">
          <select
            className="form-select"
            style={{ maxWidth: '280px' }}
            value={fechaFiltro ?? ''}
            onChange={(e) => setFechaFiltro(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Todas las fechas</option>
            {fechas?.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre} — {
                  f.estado === 'PROGRAMADA' ? 'Programada' :
                  f.estado === 'EN_JUEGO' ? 'En juego' : 'Finalizada'
                }
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <LoadingScreen label="Cargando partidos..." />
        ) : !partidos || partidos.length === 0 ? (
          <EmptyState icon="bi-joystick" title="No hay partidos para esta fecha" />
        ) : (
          <div className="card card-soft">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="text-eyebrow border-bottom">
                    <th>Partido</th>
                    <th>Hora</th>
                    <th>Estado</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {partidos.map((partido) => (
                    <tr key={partido.id}>
                      <td className="fw-semibold">
                        {partido.equipoLocal.nombre} vs {partido.equipoVisitante.nombre}
                      </td>
                      <td className="font-mono small">{formatFechaHora(partido.horaInicio)}</td>
                      <td>
                        <EstadoPartidoBadge estado={partido.estadoPartido} />
                      </td>
                      <td className="text-end">
                        {partido.estadoPartido === 'POR_JUGARSE' && (
                          <button
                            className="btn btn-sm btn-outline-warning me-2"
                            onClick={() => marcarEnJuego(partido)}
                            title="Marcar como en juego"
                          >
                            <i className="bi bi-play-fill" />
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => empezarEdicion(partido)}
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={partido.estadoPartido !== 'POR_JUGARSE'}
                          title={
                            partido.estadoPartido !== 'POR_JUGARSE'
                              ? 'Solo se puede eliminar un partido que no haya empezado'
                              : undefined
                          }
                          onClick={() => {
                            if (confirm('¿Eliminar este partido?')) {
                              eliminarPartido.mutate(partido.id);
                            }
                          }}
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}