import { z } from 'zod';

// Mensajes de validación en español
z.config(z.locales.es());

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

// Paginación y orden, comunes a todos los listados
export const paginationFields = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  order: z.enum(['asc', 'desc']).default('asc')
};

// Fecha y hora ISO con zona horaria, normalizada a UTC
export const isoDateTime = z.iso.datetime({ offset: true }).transform((v) => new Date(v).toISOString());

export const atLeastOneField = (schema) =>
  schema.refine((obj) => Object.keys(obj).length > 0, { message: 'Debe enviar al menos un campo' });