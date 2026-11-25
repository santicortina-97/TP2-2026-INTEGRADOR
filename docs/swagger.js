import { readFileSync } from 'node:fs';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { parse } from 'yaml';

// Lee docs/openapi.yaml y lo publica con Swagger UI
export const makeDocsRouter = () => {
  const spec = parse(readFileSync(new URL('./openapi.yaml', import.meta.url), 'utf8'));
  const router = Router();
  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
  return router;
};