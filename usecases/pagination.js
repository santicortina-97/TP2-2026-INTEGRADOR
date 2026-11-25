// Separa los parámetros de paginación de los filtros
export const toListOptions = ({ page, limit, sort, order, ...filters }) => ({ page, limit, sort, order, filters });

export const toPage = ({ data, total }, { page, limit }) => ({
  data,
  meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
});