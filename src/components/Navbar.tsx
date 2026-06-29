import { NavLink } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';

export function Navbar() {
  const { usuario, logout } = useAuth();
  const isAdmin = usuario?.rol === 'ADMIN';

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link prode-link px-3 ${isActive ? 'active' : ''}`;

  return (
    <nav className="navbar navbar-expand-lg prode-navbar sticky-top">
      <div className="container">

        {/* BRAND */}
        <NavLink
          to={isAdmin ? "/admin" : "/"}
          className="navbar-brand prode-brand d-flex align-items-center gap-2"
        >
          <i className="bi bi-trophy-fill text-dorado" />
          PRODE<span className="brand-dot">.</span>
        </NavLink>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#prodeNav"
          aria-controls="prodeNav"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* LINKS */}
        <div className="collapse navbar-collapse" id="prodeNav">
          <ul className="navbar-nav me-auto">

            {/* SIEMPRE (USER + ADMIN) */}
            <li className="nav-item">
              <NavLink to="/partidos" className={linkClass}>
                Partidos
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/ranking" className={linkClass}>
                Ranking
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/grupos" className={linkClass}>
                Grupos
              </NavLink>
            </li>

            {/* SOLO USER */}
            {!isAdmin && (
              <li className="nav-item">
                <NavLink to="/mis-pronosticos" className={linkClass}>
                  Mis pronósticos
                </NavLink>
              </li>
            )}

            {/* SOLO ADMIN */}
            {isAdmin && (
              <li className="nav-item">
                <NavLink to="/admin" className={linkClass}>
                  <i className="bi bi-gear-fill me-1" />
                  Administración
                </NavLink>
              </li>
            )}

          </ul>

          {/* USER INFO */}
          <div className="d-flex align-items-center gap-3">
            <NavLink
              to="/perfil"
              className="d-flex align-items-center gap-2 text-decoration-none"
            >
              <span className="font-mono small text-light opacity-75">
                {usuario?.nombreUsuario}
                {isAdmin && (
                  <span className="badge bg-warning text-dark ms-2">
                    ADMIN
                  </span>
                )}
              </span>
            </NavLink>

            <button
              className="btn btn-outline-light btn-sm"
              onClick={logout}
            >
              <i className="bi bi-box-arrow-right me-1" />
              Salir
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}