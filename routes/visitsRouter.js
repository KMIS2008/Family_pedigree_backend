const express = require ("express");
const visitsRouter = express.Router();
// const validateBody = require ('../helpers/validateBody.js');
// const schema= require ("../schemas/visitSchema.js");

const ctrl = require("../controllers/visitsControllers");

visitsRouter.get("/", ctrl.getVisits);
visitsRouter.post("/",  
    // validateBody(schema.updateVisitsSchema),
     ctrl.updateVisits)

module.exports = visitsRouter;
