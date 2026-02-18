const express = require ("express");
const ctrl= require('../controllers/checkController.js');
const schema = require ('../schemas/checkSchema.js');
const validateBody = require ('../helpers/validateBody.js');

const checkRouter=express.Router();

checkRouter.post("/", validateBody(schema.checkSchema), ctrl.check);

module.exports = checkRouter;