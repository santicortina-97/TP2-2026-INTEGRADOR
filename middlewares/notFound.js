import { AppError } from '../errors/AppError.js';

export const notFound = (req, res, next) => {
  next(AppError.notFound('ROUTE_NOT_FOUND', `No existe la ruta ${req.method} ${req.originalUrl}`));
};