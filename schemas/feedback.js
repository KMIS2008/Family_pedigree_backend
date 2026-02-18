const Joi = require('joi');

 const feedbackSchema = Joi.object({
    fullName: Joi.string().required(),  
    email: Joi.string().required(),   
    phone: Joi.string().allow(''),      
})

module.exports= {feedbackSchema}