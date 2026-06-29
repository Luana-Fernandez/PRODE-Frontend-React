import { NavLink, Outlet } from 'react-router-dom';

export function AdminLayout() {
  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link ${isActive ? 'active fw-semibold' : 'text-secondary'}`;

  return (
    <div>
      <div className="mb-4">
        <span className="text-eyebrow d-block">Panel</span>
        <h1 className="h3 mb-0">Administración</h1>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <NavLink to="/admin/equipos" className={tabClass}>
            <i className="bi bi-shield-fill me-1" />
            Equipos
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/fechas" className={tabClass}>
            <i className="bi bi-calendar3 me-1" />
            Fechas
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/partidos" className={tabClass}>
            <i className="bi bi-joystick me-1" />
            Partidos
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/resultados" className={tabClass}>
            <i className="bi bi-clipboard-check me-1" />
            Resultados
          </NavLink>
        </li>
      </ul>

      <Outlet />
    </div>
  );
}
