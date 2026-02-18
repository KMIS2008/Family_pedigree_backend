const express = require ("express");
const ctrl = require('../controllers/emailControllers');
const emailRouter=express.Router();


emailRouter.post("/send-services",  ctrl.sendServices);

module.exports = emailRouter;