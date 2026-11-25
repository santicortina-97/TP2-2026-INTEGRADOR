// El controlador solo traduce HTTP <-> casos de uso. No conoce ningún DAO.
// Express 5 captura los errores de funciones async y los manda al errorHandler.
export const makeCrudController = (useCases) => ({
    list: async (req, res) => {
      res.json(await useCases.list(req.valid.query));
    },
  
    getById: async (req, res) => {
      res.json(await useCases.getById(req.valid.params.id));
    },
  
    create: async (req, res) => {
      res.status(201).json(await useCases.create(req.valid.body));
    },
  
    update: async (req, res) => {
      res.json(await useCases.update(req.valid.params.id, req.valid.body));
    },
  
    remove: async (req, res) => {
      await useCases.remove(req.valid.params.id);
      res.status(204).end();
    }
  });