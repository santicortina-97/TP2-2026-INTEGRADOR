import { z } from 'zod';
import { paginationFields, atLeastOneField } from './common.schema.js';

export const createDuenioSchema = z.strictObject({
  nombre: z.string().trim().min(2).max(100),
  email: z.email().toLowerCase(),
  telefono: z.string().trim().min(6).max(20).optional()
});

export const updateDuenioSchema = atLeastOneField(createDuenioSchema.partial());

export const listDueniosQuerySchema = z.object({
  ...paginationFields,
  sort: z.enum(['id', 'nombre', 'email', 'createdAt']).default('id'),
  nombre: z.string().trim().min(1).optional()
});