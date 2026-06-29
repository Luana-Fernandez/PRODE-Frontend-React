import { useMemo, useState } from 'react';
import {
  useUsuarios,
  useEliminarUsuario,
  useRestaurarUsuario,
} from '@/hooks/useUsuarios';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';
import type { UsuarioResponse } from '@/api/usuariosApi';

type Tab = 'ACTIVOS' | 'INACTIVOS';

export function AdminUsuariosPage() {
  const { data: usuarios, isLoading } = useUsuarios();
  const eliminarUsuario = useEliminarUsuario();
  const restaurarUsuario = useRestaurarUsuario();

  const [tab, setTab] = useState<Tab>('ACTIVOS');

  const [usuarioAEliminar, setUsuarioAEliminar] =
    useState<UsuarioResponse | null>(null);

  const usuariosFiltrados = useMemo(() => {
    if (!usuarios) return [];
    return usuarios.filter((u) =>
      tab === 'ACTIVOS' ? u.activo : !u.activo
    );
  }, [usuarios, tab]);

  if (isLoading) return <LoadingScreen label="Cargando usuarios..." />;

  const confirmarEliminacion = () => {
    if (!usuarioAEliminar) return;

    eliminarUsuario.mutate(usuarioAEliminar.id, {
      onSuccess: () => setUsuarioAEliminar(null),
    });
  };

  return (
    <div>
      {/* TABS */}
      <div className="d-flex gap-2 mb-3">
        <button
          type="button"
          className={`btn btn-sm ${tab === 'ACTIVOS' ? 'btn-success' : 'btn-outline-secondary'}`}
          onClick={() => setTab('ACTIVOS')}
        >
          Activos
        </button>
        <button
          type="button"
          className={`btn btn-sm ${tab === 'INACTIVOS' ? 'btn-success' : 'btn-outline-secondary'}`}
          onClick={() => setTab('INACTIVOS')}
        >
          Inactivos
        </button>
      </div>

      {usuariosFiltrados.length === 0 ? (
        <EmptyState
          icon="bi-people"
          title={tab === 'ACTIVOS' ? 'No hay usuarios activos' : 'No hay usuarios inactivos'}
          description={
            tab === 'ACTIVOS'
              ? 'Aún no se registró ningún usuario en el sistema.'
              : 'No hay usuarios eliminados por el momento.'
          }
        />
      ) : (
        <div className="card card-soft">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr className="text-eyebrow border-bottom">
                  <th>#</th>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Grupo propio</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((u) => (
                  <tr key={u.id}>
                    <td className="font-mono small text-secondary">{u.id}</td>
                    <td className="fw-semibold">{u.nombreUsuario}</td>
                    <td className="small text-secondary">{u.email}</td>
                    <td>
                      <span className={`badge ${u.rol === 'ADMIN' ? 'bg-danger' : 'bg-secondary'}`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="font-mono small">
                      {u.idGrupoPropio ? `#${u.idGrupoPropio}` : <span className="text-secondary">—</span>}
                    </td>
                    <td className="text-end">
                      {tab === 'ACTIVOS' ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setUsuarioAEliminar(u)}
                        >
                          <i className="bi bi-trash me-1" />
                          Eliminar
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success"
                          onClick={() => restaurarUsuario.mutate(u.id)}
                          disabled={restaurarUsuario.isPending}
                        >
                          <i className="bi bi-arrow-counterclockwise me-1" />
                          Restaurar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      {usuarioAEliminar && (
        <div
          className="modal d-block"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Eliminar usuario</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setUsuarioAEliminar(null)}
                />
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  ¿Seguro que querés eliminar a{' '}
                  <strong>{usuarioAEliminar.nombreUsuario}</strong> (
                  {usuarioAEliminar.email})?
                </p>
                <p className="small text-secondary mt-2 mb-0">
                  El usuario deja de aparecer en el sistema, pero podés
                  restaurarlo después desde la pestaña "Inactivos".
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setUsuarioAEliminar(null)}
                  disabled={eliminarUsuario.isPending}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmarEliminacion}
                  disabled={eliminarUsuario.isPending}
                >
                  {eliminarUsuario.isPending ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}