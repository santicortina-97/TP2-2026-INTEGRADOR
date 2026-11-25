import { BaseMemoryDao } from './BaseMemoryDao.js';

export class MascotaMemoryDao extends BaseMemoryDao {
  matches(mascota, { nombre, especie, duenioId }) {
    if (nombre && !mascota.nombre.toLowerCase().includes(nombre.toLowerCase())) return false;
    if (especie && mascota.especie !== especie) return false;
    if (duenioId && mascota.duenioId !== duenioId) return false;
    return true;
  }
}