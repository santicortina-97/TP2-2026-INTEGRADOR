import { z } from 'zod';
import { paginationFields, atLeastOneField } from './common.schema.js';

export const ESPECIES = ['perro', 'gato', 'ave', 'conejo', 'otro'];

export const createMascotaSchema = z.strictObject({
  nombre: z.string().trim().min(1).max(100),
  especie: z.enum(ESPECIES),
  raza: z.string().trim().max(100).optional(),
  fechaNacimiento: z.iso.date().optional(),
  duenioId: z.number().int().positive()
});

export const updateMascotaSchema = atLeastOneField(createMascotaSchema.partial());

export const listMascotasQuerySchema = z.object({
  ...paginationFields,
  sort: z.enum(['id', 'nombre', 'especie', 'createdAt']).default('id'),
  nombre: z.string().trim().min(1).optional(),
  especie: z.enum(ESPECIES).optional(),
  duenioId: z.coerce.number().int().positive().optional()
});