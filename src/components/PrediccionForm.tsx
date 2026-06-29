import { useState } from 'react';
import { useCrearPrediccion } from '@/hooks/usePredicciones';
import type { Partido, Prediccion } from '@/types/domain';
import { estaBloqueado, minutosHastaBloqueo } from '@/utils/datetime';

interface PrediccionFormProps {
  partido: Partido;
  prediccionExistente?: Prediccion;
}

export function PrediccionForm({ partido, prediccionExistente }: PrediccionFormProps) {
  const [golLocal, setGolLocal] = useState(prediccionExistente?.golLocal ?? 0);
  const [golVisitante, setGolVisitante] = useState(prediccionExistente?.golVisitante ?? 0);
  const crearPrediccion = useCrearPrediccion();

  const bloqueado = estaBloqueado(partido.horaInicio) || partido.estadoPartido !== 'POR_JUGARSE';
  const minutosRestantes = minutosHastaBloqueo(partido.horaInicio);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    crearPrediccion.mutate({
      partidoId: partido.id,
      golLocal,
      golVisitante,
    });
  };

  const ajustar = (setter: (v: number) => void, valor: number, delta: number) => {
    setter(Math.max(0, valor + delta));
  };

  if (bloqueado) {
    return (
      <div className="d-flex align-items-center gap-2 text-light opacity-75 small">
        <i className="bi bi-lock-fill" />
        {partido.estadoPartido === 'POR_JUGARSE'
          ? 'Pronósticos cerrados (faltan menos de 30 min)'
          : 'Pronósticos cerrados para este partido'}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="d-flex align-items-center gap-3 flex-wrap">
      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          className="btn btn-sm btn-outline-light"
          onClick={() => ajustar(setGolLocal, golLocal, -1)}
        >
          <i className="bi bi-dash" />
        </button>
        <span className="font-mono fs-5 text-dorado" style={{ minWidth: '1.5ch', textAlign: 'center' }}>
          {golLocal}
        </span>
        <button
          type="button"
          className="btn btn-sm btn-outline-light"
          onClick={() => ajustar(setGolLocal, golLocal, 1)}
        >
          <i className="bi bi-plus" />
        </button>
      </div>

      <span className="text-light opacity-50 font-mono">–</span>

      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          className="btn btn-sm btn-outline-light"
          onClick={() => ajustar(setGolVisitante, golVisitante, -1)}
        >
          <i className="bi bi-dash" />
        </button>
        <span className="font-mono fs-5 text-dorado" style={{ minWidth: '1.5ch', textAlign: 'center' }}>
          {golVisitante}
        </span>
        <button
          type="button"
          className="btn btn-sm btn-outline-light"
          onClick={() => ajustar(setGolVisitante, golVisitante, 1)}
        >
          <i className="bi bi-plus" />
        </button>
      </div>

      <button type="submit" className="btn btn-warning btn-sm ms-auto" disabled={crearPrediccion.isPending}>
        {crearPrediccion.isPending ? (
          <span className="spinner-border spinner-border-sm" />
        ) : prediccionExistente ? (
          'Actualizar'
        ) : (
          'Pronosticar'
        )}
      </button>

      {minutosRestantes > 0 && minutosRestantes <= 120 && (
        <span className="font-mono small text-light opacity-50 w-100">
          Cierra en {minutosRestantes} min
        </span>
      )}
    </form>
  );
}
