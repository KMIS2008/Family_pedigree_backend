const { Schema, model}= require('mongoose');
const handleMongooseError= require('../helpers/handleMongooseError')

const feedbackSchema= new Schema({

    fullName:  {
        type: String,
      },
    email:  {
        type: String,
      },
    phone:  {
        type: String,
        required: false, // Поле не обязательно
        default: null,   // По умолчанию null
      },

},{versionKey:false, timestamps:true});

feedbackSchema.post('save', handleMongooseError);

const Feedback = model('feedback', feedbackSchema);

module.exports = Feedback;