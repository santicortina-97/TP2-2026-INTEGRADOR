import { AppError } from '../errors/AppError.js';
import { toListOptions, toPage } from './pagination.js';

export const makeDuenioUseCases = ({ duenioDao, mascotaDao }) => {
  const getOrFail = async (id) => {
    const duenio = await duenioDao.findById(id);
    if (!duenio) throw AppError.notFound('DUENIO_NOT_FOUND', `No existe el dueño ${id}`);
    return duenio;
  };

  // Regla de negocio: el email de un dueño no se puede repetir
  const assertEmailDisponible = async (email, exceptId = null) => {
    const existente = await duenioDao.findByEmail(email);
    if (existente && existente.id !== exceptId) {
      throw AppError.conflict('EMAIL_DUPLICADO', `Ya existe un dueño con el email ${email}`);
    }
  };

  return {
    list: async (query) => {
      const options = toListOptions(query);
      return toPage(await duenioDao.findAll(options), options);
    },

    getById: getOrFail,

    create: async (data) => {
      await assertEmailDisponible(data.email);
      return duenioDao.create(data);
    },

    update: async (id, data) => {
      await getOrFail(id);
      if (data.email) await assertEmailDisponible(data.email, id);
      return duenioDao.update(id, data);
    },

    remove: async (id) => {
      await getOrFail(id);
      const { total } = await mascotaDao.findAll({ filters: { duenioId: id }, page: 1, limit: 1 });
      if (total > 0) {
        throw AppError.conflict('DUENIO_CON_MASCOTAS', 'No se puede eliminar un dueño que tiene mascotas');
      }
      await duenioDao.delete(id);
    }
  };
};