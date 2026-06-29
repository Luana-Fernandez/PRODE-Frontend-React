import { useUsuarios } from '@/hooks/useUsuarios';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmptyState } from '@/components/EmptyState';

export function AdminUsuariosPage() {
  const { data: usuarios, isLoading } = useUsuarios();

  if (isLoading) return <LoadingScreen label="Cargando usuarios..." />;

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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}