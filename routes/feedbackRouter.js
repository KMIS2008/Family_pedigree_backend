const express = require ("express");
const ctrl= require('../controllers/feedbackControllers.js');
const schema = require ('../schemas/feedback.js');
const validateBody = require ('../helpers/validateBody.js');
const isValidId = require('../middlewares/isValidId');


const feedbackRouter=express.Router();

feedbackRouter.get("/", ctrl.getFeedback);

feedbackRouter.post("/", validateBody(schema.feedbackSchema), ctrl.addFeedback);

feedbackRouter.delete("/:id", isValidId, ctrl.deleteFeedback);

module.exports = feedbackRouter;