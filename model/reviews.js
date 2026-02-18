const { Schema, model}= require('mongoose');
const handleMongooseError= require('../helpers/handleMongooseError')

const reviewsSchema= new Schema({
   
    photo:  {
        type: String,
      },
    name:  {
        type: String,
      },
    testimonial:  {
        type: String,
      },
    
},{versionKey:false, timestamps:true});

reviewsSchema.post('save', handleMongooseError);

const Reviews = model('customer-review', reviewsSchema);

module.exports = Reviews;