import { Router } from 'express';
import { createDaos } from '../dao/factory.js';
import { makeDuenioUseCases } from '../usecases/duenio.usecases.js';
import { makeMascotaUseCases } from '../usecases/mascota.usecases.js';
import { makeTurnoUseCases } from '../usecases/turno.usecases.js';
import { makeCrudController } from '../controllers/crud.controller.js';
import { makeCrudRouter } from '../routes/crud.routes.js';
import { createDuenioSchema, updateDuenioSchema, listDueniosQuerySchema } from '../schemas/duenio.schema.js';
import { createMascotaSchema, updateMascotaSchema, listMascotasQuerySchema } from '../schemas/mascota.schema.js';
import { createTurnoSchema, updateTurnoSchema, listTurnosQuerySchema } from '../schemas/turno.schema.js';

// Composition Root: el único lugar que conoce las implementaciones concretas
export const createContainer = async (config) => {
  // 1. DAOs según la persistencia elegida
  const { duenioDao, mascotaDao, turnoDao } = await createDaos(config.persistenceType);

  // 2. Casos de uso: reciben los DAOs por parámetro
  const duenioUseCases = makeDuenioUseCases({ duenioDao, mascotaDao });
  const mascotaUseCases = makeMascotaUseCases({ mascotaDao, duenioDao, turnoDao });
  const turnoUseCases = makeTurnoUseCases({ turnoDao, mascotaDao });

  // 3. Controladores: reciben los casos de uso
  const duenioController = makeCrudController(duenioUseCases);
  const mascotaController = makeCrudController(mascotaUseCases);
  const turnoController = makeCrudController(turnoUseCases);

  // 4. Routers montados con su prefijo
  const router = Router();
  router.use('/api/duenios', makeCrudRouter(duenioController, {
    listQuery: listDueniosQuerySchema, create: createDuenioSchema, update: updateDuenioSchema
  }));
  router.use('/api/mascotas', makeCrudRouter(mascotaController, {
    listQuery: listMascotasQuerySchema, create: createMascotaSchema, update: updateMascotaSchema
  }));
  router.use('/api/turnos', makeCrudRouter(turnoController, {
    listQuery: listTurnosQuerySchema, create: createTurnoSchema, update: updateTurnoSchema
  }));

  return { router };
};