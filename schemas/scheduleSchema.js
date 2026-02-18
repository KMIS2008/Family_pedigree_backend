const Joi = require('joi');

 const scheduleSchema = Joi.object({
    title: Joi.string().required(), 
    date: Joi.string().required(),  
    time: Joi.string().required(),      
})

module.exports= {scheduleSchema}