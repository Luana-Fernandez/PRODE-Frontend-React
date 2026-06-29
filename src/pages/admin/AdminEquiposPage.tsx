import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useActualizarEquipo,
  useCrearEquipo,
  useEliminarEquipo,
  useEquipos,
} from '@/hooks/useEquipos';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';
import type { Equipo, EquipoCreateRequest } from '@/types/domain';

export function AdminEquiposPage() {
  const { data: equipos, isLoading } = useEquipos();
  const crearEquipo = useCrearEquipo();
  const actualizarEquipo = useActualizarEquipo();
  const eliminarEquipo = useEliminarEquipo();

  const [editando, setEditando] = useState<Equipo | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EquipoCreateRequest>();

  const onSubmit = (data: EquipoCreateRequest) => {
    if (editando) {
      actualizarEquipo.mutate(
        { id: editando.id, data: { nombre: data.nombre } },
        {
          onSuccess: () => { setEditando(null); reset(); },
          onError: () => setTimeout(() => { setEditando(null); reset(); }, 1500),
        }
      );
    } else {
      crearEquipo.mutate(data, {
        onSuccess: () => reset(),
        onError: () => setTimeout(() => reset(), 1500),
      });
    }
  };
  const empezarEdicion = (equipo: Equipo) => {
    setEditando(equipo);
    reset({ nombre: equipo.nombre });
  };

  const cancelarEdicion = () => {
    setEditando(null);
    reset({ nombre: '' });
  };

  if (isLoading) return <LoadingScreen label="Cargando equipos..." />;

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-4">
        <div className="card card-soft">
          <div className="card-body">
            <h5 className="mb-3">{editando ? 'Editar equipo' : 'Nuevo equipo'}</h5>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Nombre</label>
                <input
                  className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                  placeholder="Ej: River Plate"
                  {...register('nombre', { required: 'El nombre es obligatorio' })}
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
              </div>
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={crearEquipo.isPending || actualizarEquipo.isPending}
                >
                  {editando ? 'Guardar cambios' : 'Crear equipo'}
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
        {!equipos || equipos.length === 0 ? (
          <EmptyState icon="bi-shield" title="No hay equipos cargados" />
        ) : (
          <div className="card card-soft">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="text-eyebrow border-bottom">
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {equipos.map((equipo) => (
                    <tr key={equipo.id}>
                      <td className="fw-semibold">{equipo.nombre}</td>
                      <td>
                        {equipo.eliminado ? (
                          <span className="badge bg-secondary">Eliminado</span>
                        ) : (
                          <span className="badge bg-success">Activo</span>
                        )}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => empezarEdicion(equipo)}
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            if (confirm(`¿Eliminar el equipo "${equipo.nombre}"?`)) {
                              eliminarEquipo.mutate(equipo.id);
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
