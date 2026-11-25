import { DuenioMemoryDao } from './memory/DuenioMemoryDao.js';
import { MascotaMemoryDao } from './memory/MascotaMemoryDao.js';
import { TurnoMemoryDao } from './memory/TurnoMemoryDao.js';
import { DuenioSequelizeDao } from './sequelize/DuenioSequelizeDao.js';
import { MascotaSequelizeDao } from './sequelize/MascotaSequelizeDao.js';
import { TurnoSequelizeDao } from './sequelize/TurnoSequelizeDao.js';
import { initDatabase } from './models/index.js';

export const createDaos = async (config) => {
  switch (config.persistenceType) {
    case 'memory':
      return {
        duenioDao: new DuenioMemoryDao(),
        mascotaDao: new MascotaMemoryDao(),
        turnoDao: new TurnoMemoryDao()
      };
    case 'sqlite': {
      const { Duenio, Mascota, Turno } = await initDatabase(config.dbStorage);
      return {
        duenioDao: new DuenioSequelizeDao(Duenio),
        mascotaDao: new MascotaSequelizeDao(Mascota),
        turnoDao: new TurnoSequelizeDao(Turno)
      };
    }
    default:
      throw new Error(`PERSISTENCE_TYPE no soportado: ${config.persistenceType}`);
  }
};