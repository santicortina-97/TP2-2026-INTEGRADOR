import { BaseMemoryDao } from './BaseMemoryDao.js';

export class DuenioMemoryDao extends BaseMemoryDao {
  matches(duenio, { nombre }) {
    if (nombre && !duenio.nombre.toLowerCase().includes(nombre.toLowerCase())) return false;
    return true;
  }

  async findByEmail(email) {
    const duenio = this.items.find((d) => d.email === email);
    return duenio ? { ...duenio } : null;
  }
}