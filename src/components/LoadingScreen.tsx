export function LoadingScreen({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border text-success" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
        <span className="visually-hidden">{label}</span>
      </div>
      <p className="mt-3 text-secondary font-mono small">{label}</p>
    </div>
  );
}
