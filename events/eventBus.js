import { EventEmitter } from 'node:events';

// Nombres de los eventos de dominio, en un solo lugar
export const EVENTOS = {
  TURNO_CREADO: 'turno.creado',
  TURNO_CANCELADO: 'turno.cancelado'
};

export const createEventBus = () => new EventEmitter();