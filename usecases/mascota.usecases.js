import { AppError } from '../errors/AppError.js';
import { toListOptions, toPage } from './pagination.js';

export const makeMascotaUseCases = ({ mascotaDao, duenioDao, turnoDao }) => {
  const getOrFail = async (id) => {
    const mascota = await mascotaDao.findById(id);
    if (!mascota) throw AppError.notFound('MASCOTA_NOT_FOUND', `No existe la mascota ${id}`);
    return mascota;
  };

  const assertDuenioExiste = async (duenioId) => {
    const duenio = await duenioDao.findById(duenioId);
    if (!duenio) throw AppError.notFound('DUENIO_NOT_FOUND', `No existe el dueño ${duenioId}`);
  };

  return {
    list: async (query) => {
      const options = toListOptions(query);
      return toPage(await mascotaDao.findAll(options), options);
    },

    getById: getOrFail,

    create: async (data) => {
      await assertDuenioExiste(data.duenioId);
      return mascotaDao.create(data);
    },

    update: async (id, data) => {
      await getOrFail(id);
      if (data.duenioId) await assertDuenioExiste(data.duenioId);
      return mascotaDao.update(id, data);
    },

    remove: async (id) => {
      await getOrFail(id);
      const { total } = await turnoDao.findAll({ filters: { mascotaId: id }, page: 1, limit: 1 });
      if (total > 0) {
        throw AppError.conflict('MASCOTA_CON_TURNOS', 'No se puede eliminar una mascota que tiene turnos');
      }
      await mascotaDao.delete(id);
    }
  };
};