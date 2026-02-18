const express = require('express');
const personRouter = express.Router();
const ctrl = require('../controllers/personControllers');
const schema = require('../schemas/personSchema');
const validateBody = require ('../helpers/validateBody.js');
const { upload } = require('../middlewares/uploadMiddleware');
const isValidId = require('../middlewares/isValidId');



// GET: Отримати всіх людей
personRouter.get('/', ctrl.getAllPersons);

// // GET: Отримати одну особу за ID
personRouter.get('/:id', isValidId, ctrl.getPersonById);

// // POST: Створити нову особу

personRouter.post("/", validateBody(schema.personSchema), upload.single('photo'), ctrl.createPerson);


// // PUT: Оновити дані особи
personRouter.put('/:id',
  isValidId,
  upload.single('photo'),
  validateBody(schema.personSchema),
  ctrl.updatePerson
);

// // DELETE: Видалити особу
personRouter.delete('/:id', isValidId, ctrl.deletePerson);


// // GET: Отримати генеалогічне дерево
personRouter.get('/:id/family-tree', isValidId, ctrl.getFamilyTree);

module.exports = personRouter;