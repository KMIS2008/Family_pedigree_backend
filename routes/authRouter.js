const express = require ("express");
const validateBody = require ('../helpers/validateBody.js');
const {registrSchema, emailSchema} = require('../schemas/authSchema.js');
const ctr = require('../controllers/authControllers.js');
const authRouter = express.Router();
const authdentificate = require('../middlewares/authdentificate.js');


authRouter.post("/register", validateBody(registrSchema), ctr.register);

authRouter.post("/login", validateBody(registrSchema), ctr.login);

authRouter.get("/current", authdentificate, ctr.getCurrent);

authRouter.post("/logout", authdentificate, ctr.logout);


module.exports = authRouter;