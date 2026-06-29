const BLOQUEO_MINUTOS = 30;

/**
 * Replica en el cliente la regla de negocio del servidor (PrediccionCreateService.validarReglaBloqueo)
 * únicamente para dar feedback visual inmediato (deshabilitar el form, mostrar cuenta regresiva).
 * La validación real y autoritativa siempre la hace el backend con su Clock UTC.
 */
export function estaBloqueado(horaInicioIso: string, ahora: Date = new Date()): boolean {
  const horaInicio = new Date(horaInicioIso);
  const limite = new Date(horaInicio.getTime() - BLOQUEO_MINUTOS * 60_000);
  return ahora.getTime() >= limite.getTime();
}

export function minutosHastaBloqueo(horaInicioIso: string, ahora: Date = new Date()): number {
  const horaInicio = new Date(horaInicioIso);
  const limite = new Date(horaInicio.getTime() - BLOQUEO_MINUTOS * 60_000);
  const diffMs = limite.getTime() - ahora.getTime();
  return Math.max(0, Math.round(diffMs / 60_000));
}

export function formatFechaHora(iso: string): string {
  return new Date(iso).toLocaleString('es-AR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatHora(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

/** Convierte un valor de <input type="datetime-local"> (hora local del navegador) a ISO UTC para enviar al back. */
export function localInputToIsoUtc(localValue: string): string {
  return new Date(localValue).toISOString();
}

/** Convierte un ISO UTC del back a un valor apto para <input type="datetime-local"> en hora local. */
export function isoUtcToLocalInput(iso: string): string {
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}
