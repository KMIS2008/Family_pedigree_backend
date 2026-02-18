const express = require ("express");
const ctrl= require('../controllers/scheduleControllers.js');
const schema = require ('../schemas/scheduleSchema.js');
const validateBody = require ('../helpers/validateBody.js');
const isValidId = require('../middlewares/isValidId');


const scheduleRouter=express.Router();

scheduleRouter.get("/", ctrl.getSchedule);

scheduleRouter.post("/", validateBody(schema.scheduleSchema), ctrl.addSchedule);

scheduleRouter.delete("/:id", isValidId, ctrl.deleteSchedule);

module.exports = scheduleRouter;