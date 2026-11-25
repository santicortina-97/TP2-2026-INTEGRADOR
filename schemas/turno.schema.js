import { z } from 'zod';
import { paginationFields, atLeastOneField, isoDateTime } from './common.schema.js';

export const ESTADOS_TURNO = ['pendiente', 'realizado', 'cancelado'];

export const createTurnoSchema = z.strictObject({
  mascotaId: z.number().int().positive(),
  fechaHora: isoDateTime,
  motivo: z.string().trim().min(3).max(255)
});

export const updateTurnoSchema = atLeastOneField(
  createTurnoSchema.extend({ estado: z.enum(ESTADOS_TURNO) }).partial()
);

export const listTurnosQuerySchema = z.object({
  ...paginationFields,
  sort: z.enum(['id', 'fechaHora', 'createdAt']).default('fechaHora'),
  mascotaId: z.coerce.number().int().positive().optional(),
  estado: z.enum(ESTADOS_TURNO).optional(),
  desde: isoDateTime.optional(),
  hasta: isoDateTime.optional()
});