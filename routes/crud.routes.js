import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { idParamSchema } from '../schemas/common.schema.js';

export const makeCrudRouter = (controller, { listQuery, create, update }) => {
  const router = Router();

  router.get('/', validate({ query: listQuery }), controller.list);
  router.get('/:id', validate({ params: idParamSchema }), controller.getById);
  router.post('/', validate({ body: create }), controller.create);
  router.patch('/:id', validate({ params: idParamSchema, body: update }), controller.update);
  router.delete('/:id', validate({ params: idParamSchema }), controller.remove);

  return router;
};