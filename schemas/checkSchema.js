const Joi = require('joi');


 const checkSchema = Joi.object({
    password: Joi.string().required(),     
})

module.exports= {checkSchema}