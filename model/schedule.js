const { Schema, model}= require('mongoose');
const handleMongooseError= require('../helpers/handleMongooseError')

const scheduleSchema= new Schema({

    title:  {
        type: String,
         required: false, 
      },
    date:  {
        type: String,
         required: false, 
      },
    time:  {
        type: String,
        required: false, 
      },

},{versionKey:false, timestamps:true});

scheduleSchema.post('save', handleMongooseError);

const Schedule = model('schedule', scheduleSchema);

module.exports = Schedule;