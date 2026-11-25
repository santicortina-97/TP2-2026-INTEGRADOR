import { BaseMemoryDao } from './BaseMemoryDao.js';

export class TurnoMemoryDao extends BaseMemoryDao {
  matches(turno, { mascotaId, estado, desde, hasta }) {
    if (mascotaId && turno.mascotaId !== mascotaId) return false;
    if (estado && turno.estado !== estado) return false;
    if (desde && turno.fechaHora < desde) return false;
    if (hasta && turno.fechaHora > hasta) return false;
    return true;
  }

  async findByFechaHora(fechaHora) {
    return this.items.filter((t) => t.fechaHora === fechaHora).map((t) => ({ ...t }));
  }
}