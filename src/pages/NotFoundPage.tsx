import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '70vh' }}>
      <span className="font-mono fs-1 fw-bold text-dorado">404</span>
      <h2 className="h4 mt-2">Esta página no existe</h2>
      <p className="text-secondary">Como un partido que nunca se jugó.</p>
      <Link to="/" className="btn btn-success mt-2">
        Volver al inicio
      </Link>
    </div>
  );
}
