import { Op } from 'sequelize';
import { BaseSequelizeDao } from './BaseSequelizeDao.js';

export class TurnoSequelizeDao extends BaseSequelizeDao {
  buildWhere({ mascotaId, estado, desde, hasta }) {
    const where = {};
    if (mascotaId) where.mascotaId = mascotaId;
    if (estado) where.estado = estado;
    if (desde || hasta) {
      where.fechaHora = {};
      if (desde) where.fechaHora[Op.gte] = desde;
      if (hasta) where.fechaHora[Op.lte] = hasta;
    }
    return where;
  }

  async findByFechaHora(fechaHora) {
    const rows = await this.model.findAll({ where: { fechaHora } });
    return rows.map((row) => this.toPlain(row));
  }
}