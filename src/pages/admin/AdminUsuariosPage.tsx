import { useState } from 'react';
import { useUsuarios, useEliminarUsuario } from '@/hooks/useUsuarios';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';
import type { UsuarioResponse } from '@/api/usuariosApi';

export function AdminUsuariosPage() {
  const { data: usuarios, isLoading } = useUsuarios();
  const eliminarUsuario = useEliminarUsuario();

  const [usuarioAEliminar, setUsuarioAEliminar] =
    useState<UsuarioResponse | null>(null);

  if (isLoading) return <LoadingScreen label="Cargando usuarios..." />;

  const confirmarEliminacion = () => {
    if (!usuarioAEliminar) return;

    eliminarUsuario.mutate(usuarioAEliminar.id, {
      onSuccess: () => setUsuarioAEliminar(null),
    });
  };

  return (
    <div>
      {!usuarios || usuarios.length === 0 ? (
        <EmptyState
          icon="bi-people"
          title="No hay usuarios registrados"
          description="Aún no se registró ningún usuario en el sistema."
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
                {usuarios.map((u) => (
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
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setUsuarioAEliminar(u)}
                      >
                        <i className="bi bi-trash me-1" />
                        Eliminar
                      </button>
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
                  El usuario deja de aparecer en el sistema, pero sus datos no
                  se borran de forma permanente.
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