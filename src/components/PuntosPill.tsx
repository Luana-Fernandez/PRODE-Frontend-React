interface PuntosPillProps {
  puntos: number | null;
  esExacta?: boolean;
}

export function PuntosPill({ puntos, esExacta }: PuntosPillProps) {
  if (puntos === null) {
    return (
      <span className="puntos-pill puntos-pendiente">
        <i className="bi bi-hourglass-split" />
        Pendiente
      </span>
    );
  }

  const claseColor = puntos === 3 ? 'puntos-3' : puntos === 1 ? 'puntos-1' : 'puntos-0';
  const icono = esExacta ? 'bi-bullseye' : puntos === 1 ? 'bi-check2' : 'bi-x-lg';

  return (
    <span className={`puntos-pill ${claseColor}`}>
      <i className={`bi ${icono}`} />
      {puntos} {puntos === 1 ? 'punto' : 'puntos'}
    </span>
  );
}