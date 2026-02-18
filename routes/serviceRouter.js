const express = require ("express");
const ctrl= require('../controllers/serviceControllers.js');
const schema = require ('../schemas/serviceSchema.js');
const validateBody = require ('../helpers/validateBody.js');
const isValidId = require('../middlewares/isValidId');


const serviceRouter=express.Router();

serviceRouter.get("/", ctrl.getService);

serviceRouter.post("/", validateBody(schema.serviceSchema), ctrl.addService);

serviceRouter.delete("/:id", isValidId, ctrl.deleteService);

module.exports = serviceRouter;