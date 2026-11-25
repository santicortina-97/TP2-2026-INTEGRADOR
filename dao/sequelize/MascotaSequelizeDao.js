import { Op } from 'sequelize';
import { BaseSequelizeDao } from './BaseSequelizeDao.js';

export class MascotaSequelizeDao extends BaseSequelizeDao {
  buildWhere({ nombre, especie, duenioId }) {
    const where = {};
    if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };
    if (especie) where.especie = especie;
    if (duenioId) where.duenioId = duenioId;
    return where;
  }
}