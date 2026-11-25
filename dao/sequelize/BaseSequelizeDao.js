// Misma interfaz que BaseMemoryDao:
//   findAll({ filters, page, limit, sort, order }) -> { data, total }
//   findById(id) / create(data) / update(id, data) / delete(id)
// Siempre devuelve objetos planos, nunca instancias de Sequelize.
export class BaseSequelizeDao {
    constructor(model) {
      this.model = model;
    }
  
    // Cada DAO concreto la redefine según sus filtros
    buildWhere(filters) {
      return {};
    }
  
    // Instancia de Sequelize -> objeto plano, con la misma forma que el DAO en memoria
    toPlain(instance) {
      if (!instance) return null;
      const plain = instance.get({ plain: true });
      for (const key of Object.keys(plain)) {
        if (plain[key] === null) delete plain[key];
        else if (plain[key] instanceof Date) plain[key] = plain[key].toISOString();
      }
      return plain;
    }
  
    async findAll({ filters = {}, page = 1, limit = 10, sort = 'id', order = 'asc' } = {}) {
      const { rows, count } = await this.model.findAndCountAll({
        where: this.buildWhere(filters),
        order: [[sort, order.toUpperCase()]],
        limit,
        offset: (page - 1) * limit
      });
      return { data: rows.map((row) => this.toPlain(row)), total: count };
    }
  
    async findById(id) {
      return this.toPlain(await this.model.findByPk(id));
    }
  
    async create(data) {
      return this.toPlain(await this.model.create(data));
    }
  
    async update(id, data) {
      const instance = await this.model.findByPk(id);
      if (!instance) return null;
      await instance.update(data);
      return this.toPlain(instance);
    }
  
    async delete(id) {
      const deleted = await this.model.destroy({ where: { id } });
      return deleted > 0;
    }
  }