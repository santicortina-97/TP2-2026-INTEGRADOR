import { Op } from 'sequelize';
import { BaseSequelizeDao } from './BaseSequelizeDao.js';

export class DuenioSequelizeDao extends BaseSequelizeDao {
  buildWhere({ nombre }) {
    const where = {};
    if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };
    return where;
  }

  async findByEmail(email) {
    return this.toPlain(await this.model.findOne({ where: { email } }));
  }
}