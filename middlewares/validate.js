import { AppError } from '../errors/AppError.js';

// Uso: validate({ params: schema, query: schema, body: schema })
export const validate = (schemas) => (req, res, next) => {
  const valid = {};
  const details = [];

  for (const part of ['params', 'query', 'body']) {
    if (!schemas[part]) continue;
    const result = schemas[part].safeParse(req[part] ?? {});
    if (result.success) {
      valid[part] = result.data;
    } else {
      for (const issue of result.error.issues) {
        details.push({ in: part, path: issue.path.join('.'), message: issue.message });
      }
    }
  }

  if (details.length > 0) {
    return next(new AppError('VALIDATION_ERROR', 'Datos de entrada inválidos', 400, details));
  }

  req.valid = valid;
  next();
};