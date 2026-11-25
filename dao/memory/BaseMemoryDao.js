// Interfaz común de todos los DAO (memoria y base de datos):
//   findAll({ filters, page, limit, sort, order }) -> { data, total }
//   findById(id)       -> objeto | null
//   create(data)       -> objeto creado
//   update(id, data)   -> objeto actualizado | null
//   delete(id)         -> true | false
// Siempre devuelven objetos planos (copias), nunca la referencia interna.
export class BaseMemoryDao {
    constructor() {
      this.items = [];
      this.nextId = 1;
    }
  
    // Cada DAO concreto la redefine según sus filtros
    matches(item, filters) {
      return true;
    }
  
    async findAll({ filters = {}, page = 1, limit = 10, sort = 'id', order = 'asc' } = {}) {
      const filtered = this.items.filter((item) => this.matches(item, filters));
      const direction = order === 'desc' ? -1 : 1;
  
      filtered.sort((a, b) => {
        const x = a[sort];
        const y = b[sort];
        if (x === y) return 0;
        if (x === undefined || x === null) return 1;
        if (y === undefined || y === null) return -1;
        if (typeof x === 'string') return x.localeCompare(y) * direction;
        return (x < y ? -1 : 1) * direction;
      });
  
      const start = (page - 1) * limit;
      const data = filtered.slice(start, start + limit).map((item) => ({ ...item }));
      return { data, total: filtered.length };
    }
  
    async findById(id) {
      const item = this.items.find((i) => i.id === id);
      return item ? { ...item } : null;
    }
  
    async create(data) {
      const now = new Date().toISOString();
      const item = { id: this.nextId++, ...data, createdAt: now, updatedAt: now };
      this.items.push(item);
      return { ...item };
    }
  
    async update(id, data) {
      const index = this.items.findIndex((i) => i.id === id);
      if (index === -1) return null;
      this.items[index] = { ...this.items[index], ...data, id, updatedAt: new Date().toISOString() };
      return { ...this.items[index] };
    }
  
    async delete(id) {
      const index = this.items.findIndex((i) => i.id === id);
      if (index === -1) return false;
      this.items.splice(index, 1);
      return true;
    }
  }