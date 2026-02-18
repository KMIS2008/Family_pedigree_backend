const Joi = require('joi');

 const serviceSchema = Joi.object({
    type: Joi.string().required(), 
    fullName: Joi.string().required(),  
    email: Joi.string().required(),   
    phone: Joi.string().allow(''),      
})

module.exports= {serviceSchema}