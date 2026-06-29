import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/auth/useAuth';
import {
  useCrearGrupo,
  useEliminarGrupo,
  useGrupos,
  useUnirseGrupo,
} from '@/hooks/useGrupos';
import { useRankingGrupo } from '@/hooks/useRanking';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';
import type { GrupoCreateRequest, GrupoUnirseRequest } from '@/types/domain';

function ModalCrearGrupo({ onClose }: { onClose: () => void }) {
  const crearGrupo = useCrearGrupo();
  const { register, handleSubmit, formState: { errors } } = useForm<GrupoCreateRequest>();

  const onSubmit = (data: GrupoCreateRequest) => {
    crearGrupo.mutate(data, {
      onSuccess: onClose,
      onError: () => setTimeout(onClose, 1500),
    });
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h5 className="modal-title">Crear grupo</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <label className="form-label small fw-semibold">Nombre del grupo</label>
              <input
                className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                placeholder="Ej: Amigos del barrio"
                {...register('nombre', { required: 'El nombre es obligatorio' })}
              />
              {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
              <p className="small text-secondary mt-2 mb-0">
                Se generará un código de invitación automáticamente.
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-success" disabled={crearGrupo.isPending}>
                Crear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ModalUnirseGrupo({ onClose }: { onClose: () => void }) {
  const { usuario } = useAuth();
  const unirseGrupo = useUnirseGrupo();
  const { register, handleSubmit, formState: { errors } } = useForm<GrupoUnirseRequest>();

  const onSubmit = (data: GrupoUnirseRequest) => {
    if (!usuario) return;
    unirseGrupo.mutate(
      { usuarioId: usuario.id, data },
      {
        onSuccess: onClose,
        onError: () => setTimeout(onClose, 1500),
      }
    );
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h5 className="modal-title">Unirme a un grupo</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <label className="form-label small fw-semibold">Código de invitación</label>
              <input
                className={`form-control font-mono ${errors.codigoInvitacion ? 'is-invalid' : ''}`}
                placeholder="Ej: AB12CD"
                {...register('codigoInvitacion', { required: 'Ingresá el código' })}
              />
              {errors.codigoInvitacion && (
                <div className="invalid-feedback">{errors.codigoInvitacion.message}</div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-success" disabled={unirseGrupo.isPending}>
                Unirme
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function RankingDeGrupo({ grupoId }: { grupoId: number }) {
  const { data: ranking, isLoading } = useRankingGrupo(grupoId);
  const { usuario } = useAuth();

  if (isLoading) return <LoadingScreen label="Cargando ranking del grupo..." />;
  if (!ranking || ranking.length === 0) {
    return <p className="small text-secondary mb-0">Sin pronósticos registrados todavía.</p>;
  }

  return (
    <table className="table table-sm align-middle mb-0">
      <thead>
        <tr className="text-eyebrow border-bottom">
          <th>#</th>
          <th>Usuario</th>
          <th className="text-end">Puntos</th>
        </tr>
      </thead>
      <tbody>
        {ranking.map((item, idx) => (
          <tr key={item.idUsuario} className={item.idUsuario === usuario?.id ? 'fila-ranking-propia' : ''}>
            <td className="font-mono">{item.posicion ?? idx + 1}</td>
            <td>{item.nombreUsuario}</td>
            <td className="text-end font-mono fw-bold">{item.puntosTotales}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function GruposPage() {
  const { usuario } = useAuth();
  const { data: grupos, isLoading } = useGrupos();
  const eliminarGrupo = useEliminarGrupo();
  const [modalAbierto, setModalAbierto] = useState<'crear' | 'unirse' | null>(null);
  const [grupoExpandido, setGrupoExpandido] = useState<number | null>(null);

  if (isLoading) return <LoadingScreen label="Cargando grupos..." />;

  return (
    <div>
      <div className="d-flex align-items-baseline justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <span className="text-eyebrow d-block">Competí en privado</span>
          <h1 className="h3 mb-0">Grupos</h1>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-success btn-sm" onClick={() => setModalAbierto('unirse')}>
            <i className="bi bi-person-plus me-1" />
            Unirme con código
          </button>
          <button className="btn btn-success btn-sm" onClick={() => setModalAbierto('crear')}>
            <i className="bi bi-plus-lg me-1" />
            Crear grupo
          </button>
        </div>
      </div>

      {!grupos || grupos.length === 0 ? (
        <EmptyState
          icon="bi-people"
          title="No hay grupos todavía"
          description="Creá uno o unite con un código de invitación."
        />
      ) : (
        <div className="row g-3">
          {grupos.map((grupo) => {
            const expandido = grupoExpandido === grupo.id;
            return (
              <div className="col-12 col-md-6" key={grupo.id}>
                <div className="card card-soft">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="mb-1">{grupo.nombre}</h5>
                        <span className="font-mono small text-secondary">
                          Código: <strong>{grupo.codigoInvitacion}</strong>
                        </span>
                      </div>
                      {usuario?.rol === 'ADMIN' && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => eliminarGrupo.mutate(grupo.id)}
                        >
                          <i className="bi bi-trash" />
                        </button>
                      )}
                    </div>

                    <button
                      className="btn btn-sm btn-outline-secondary mt-3"
                      onClick={() => setGrupoExpandido(expandido ? null : grupo.id)}
                    >
                      <i className={`bi bi-chevron-${expandido ? 'up' : 'down'} me-1`} />
                      {expandido ? 'Ocultar ranking' : 'Ver ranking del grupo'}
                    </button>

                    {expandido && (
                      <div className="mt-3 pt-3 border-top">
                        <RankingDeGrupo grupoId={grupo.id} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalAbierto === 'crear' && <ModalCrearGrupo onClose={() => setModalAbierto(null)} />}
      {modalAbierto === 'unirse' && <ModalUnirseGrupo onClose={() => setModalAbierto(null)} />}
    </div>
  );
}
