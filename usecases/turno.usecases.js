import { AppError } from '../errors/AppError.js';
import { toListOptions, toPage } from './pagination.js';
import { EVENTOS } from '../events/eventBus.js';

export const makeTurnoUseCases = ({ turnoDao, mascotaDao, eventBus }) => {
  const getOrFail = async (id) => {
    const turno = await turnoDao.findById(id);
    if (!turno) throw AppError.notFound('TURNO_NOT_FOUND', `No existe el turno ${id}`);
    return turno;
  };

  const assertMascotaExiste = async (mascotaId) => {
    const mascota = await mascotaDao.findById(mascotaId);
    if (!mascota) throw AppError.notFound('MASCOTA_NOT_FOUND', `No existe la mascota ${mascotaId}`);
  };

  // Regla de negocio: no puede haber dos turnos activos (no cancelados) en la misma fecha y hora
  const assertHorarioLibre = async (fechaHora, exceptId = null) => {
    const turnos = await turnoDao.findByFechaHora(fechaHora);
    const ocupado = turnos.some((t) => t.estado !== 'cancelado' && t.id !== exceptId);
    if (ocupado) {
      throw AppError.conflict('TURNO_OCUPADO', `El horario ${fechaHora} ya está ocupado`);
    }
  };

  return {
    list: async (query) => {
      const options = toListOptions(query);
      return toPage(await turnoDao.findAll(options), options);
    },

    getById: getOrFail,

    create: async (data) => {
      await assertMascotaExiste(data.mascotaId);
      await assertHorarioLibre(data.fechaHora);
      const turno = await turnoDao.create({ ...data, estado: 'pendiente' });
      eventBus.emit(EVENTOS.TURNO_CREADO, turno);
      return turno;
    },

    update: async (id, data) => {
      const actual = await getOrFail(id);
      if (data.mascotaId) await assertMascotaExiste(data.mascotaId);

      // Si cambia el horario, o se reactiva un turno cancelado, se vuelve a verificar
      const fechaHora = data.fechaHora ?? actual.fechaHora;
      const estado = data.estado ?? actual.estado;
      const cambiaHorario = data.fechaHora && data.fechaHora !== actual.fechaHora;
      const seReactiva = actual.estado === 'cancelado' && estado !== 'cancelado';
      if (estado !== 'cancelado' && (cambiaHorario || seReactiva)) {
        await assertHorarioLibre(fechaHora, id);
      }

      const turno = await turnoDao.update(id, data);
      if (actual.estado !== 'cancelado' && turno.estado === 'cancelado') {
        eventBus.emit(EVENTOS.TURNO_CANCELADO, turno);
      }
      return turno;
    },

    remove: async (id) => {
      await getOrFail(id);
      await turnoDao.delete(id);
    }
  };
};