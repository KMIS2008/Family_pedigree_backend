const { Schema, model}= require('mongoose');
const handleMongooseError= require('../helpers/handleMongooseError');


const visitSchema= new Schema({

    count:{type: Number},

},{versionKey:false, timestamps:true});

visitSchema.post('save', handleMongooseError);

const Visit = model('visit', visitSchema);

module.exports = Visit;