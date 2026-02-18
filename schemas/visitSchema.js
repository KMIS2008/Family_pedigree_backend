const Joi = require('joi');

 const updateVisitsSchema = Joi.object({
    count: Joi.number().required(),     
})

module.exports= {updateVisitsSchema}