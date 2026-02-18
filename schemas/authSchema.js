const Joi = require('joi');

const registrSchema = Joi.object({
    password: Joi.string().required(), 
    email: Joi.string().required(),
    name:Joi.string(),
    phone:Joi.string(),
});


module.exports = {registrSchema};