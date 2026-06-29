import { useEffect, useState } from 'react';
import { useMe, useActualizarUsuario } from '@/hooks/useUsuarios';
import { LoadingScreen } from '@/components/LoadingScreen';

export function PerfilPage() {
  const { data: me, isLoading } = useMe();
  const actualizarUsuario = useActualizarUsuario();

  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');

  // Sincroniza el formulario una vez que llegan los datos del usuario
  useEffect(() => {
    if (me) {
      setNombreUsuario(me.nombreUsuario);
      setEmail(me.email);
    }
  }, [me]);

  if (isLoading) return <LoadingScreen label="Cargando perfil..." />;

  if (!me) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    actualizarUsuario.mutate({
      id: me.id,
      data: { nombreUsuario, email },
    });
  };

  const hayCambios = nombreUsuario !== me.nombreUsuario || email !== me.email;

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <h1 className="h3 mb-3">Mi perfil</h1>

        <div className="card card-soft">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small text-secondary">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex align-items-center gap-2 mt-2">
                <span className="small text-secondary">Rol:</span>
                <span
                  className={`badge ${me.rol === 'ADMIN' ? 'bg-danger' : 'bg-secondary'}`}
                >
                  {me.rol}
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-success mt-3"
                disabled={!hayCambios || actualizarUsuario.isPending}
              >
                {actualizarUsuario.isPending ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}