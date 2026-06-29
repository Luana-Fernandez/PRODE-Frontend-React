import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useActualizarFecha,
  useCrearFecha,
  useEliminarFecha,
  useFechas,
} from '@/hooks/useFechas';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';
import { EstadoFechaBadge } from '@/components/EstadoBadge';
import type { Fecha, FechaCreateRequest } from '@/types/domain';

export function AdminFechasPage() {
  const { data: fechas, isLoading } = useFechas();
  const crearFecha = useCrearFecha();
  const actualizarFecha = useActualizarFecha();
  const eliminarFecha = useEliminarFecha();

  const [editando, setEditando] = useState<Fecha | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FechaCreateRequest>();

  const onSubmit = (data: FechaCreateRequest) => {
    if (editando) {
      actualizarFecha.mutate(
        { id: editando.id, data: { nombre: data.nombre } },
        {
          onSuccess: () => { setEditando(null); reset(); },
          onError: () => setTimeout(() => { setEditando(null); reset(); }, 1500),
        }
      );
    } else {
      crearFecha.mutate(data, {
        onSuccess: () => reset(),
        onError: () => setTimeout(() => reset(), 1500),
      });
    }
  };

  const empezarEdicion = (fecha: Fecha) => {
    setEditando(fecha);
    reset({ nombre: fecha.nombre });
  };

  const cancelarEdicion = () => {
    setEditando(null);
    reset({ nombre: '' });
  };

  if (isLoading) return <LoadingScreen label="Cargando fechas..." />;

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-4">
        <div className="card card-soft">
          <div className="card-body">
            <h5 className="mb-3">{editando ? 'Editar fecha' : 'Nueva fecha'}</h5>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Nombre</label>
                <input
                  className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                  placeholder="Ej: Fecha 1"
                  {...register('nombre', { required: 'El nombre es obligatorio' })}
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
              </div>
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={crearFecha.isPending || actualizarFecha.isPending}
                >
                  {editando ? 'Guardar cambios' : 'Crear fecha'}
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
        {!fechas || fechas.length === 0 ? (
          <EmptyState icon="bi-calendar3" title="No hay fechas cargadas" />
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
                  {fechas.map((fecha) => (
                    <tr key={fecha.id}>
                      <td className="fw-semibold">{fecha.nombre}</td>
                      <td>
                        <EstadoFechaBadge estado={fecha.estado} />
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => empezarEdicion(fecha)}
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={fecha.estado !== 'PROGRAMADA'}
                          title={
                            fecha.estado !== 'PROGRAMADA'
                              ? 'Solo se puede eliminar una fecha programada sin partidos'
                              : undefined
                          }
                          onClick={() => {
                            if (confirm(`¿Eliminar la fecha "${fecha.nombre}"?`)) {
                              eliminarFecha.mutate(fecha.id);
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
