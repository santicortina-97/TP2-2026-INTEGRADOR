import { EVENTOS } from './eventBus.js';

// Reacciona a los eventos de turnos usando el notificador que se le inyecte
export const registerTurnoListeners = ({ eventBus, notifier }) => {
  eventBus.on(EVENTOS.TURNO_CREADO, async (turno) => {
    try {
      await notifier.notify(`Turno ${turno.id} reservado para la mascota ${turno.mascotaId} el ${turno.fechaHora} (${turno.motivo})`);
    } catch (error) {
      console.error(`Falló la notificación de ${EVENTOS.TURNO_CREADO}:`, error.message);
    }
  });

  eventBus.on(EVENTOS.TURNO_CANCELADO, async (turno) => {
    try {
      await notifier.notify(`Turno ${turno.id} del ${turno.fechaHora} cancelado: el horario quedó libre`);
    } catch (error) {
      console.error(`Falló la notificación de ${EVENTOS.TURNO_CANCELADO}:`, error.message);
    }
  });
};