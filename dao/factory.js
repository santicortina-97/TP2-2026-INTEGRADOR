import { DuenioMemoryDao } from './memory/DuenioMemoryDao.js';
import { MascotaMemoryDao } from './memory/MascotaMemoryDao.js';
import { TurnoMemoryDao } from './memory/TurnoMemoryDao.js';

export const createDaos = async (persistenceType) => {
  switch (persistenceType) {
    case 'memory':
      return {
        duenioDao: new DuenioMemoryDao(),
        mascotaDao: new MascotaMemoryDao(),
        turnoDao: new TurnoMemoryDao()
      };
    default:
      throw new Error(`PERSISTENCE_TYPE no soportado: ${persistenceType}`);
  }
};