const { Schema, model}= require('mongoose');
const handleMongooseError= require('../helpers/handleMongooseError');

const userSchema= new Schema({
    
        password: {
          type: String,
          required: [true, 'Password is required'],
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
        },

        name: {
          type: String,
        },

        phone: {
          type: String,
        },

        token: {
          type: String,
          default: null,
        },

        verificationToken: {
          type: String,
          required: [true, 'Verify token is required'],
        },
      
},{versionKey:false, timestamps:true}) 

userSchema.post('save', handleMongooseError);

const User = model('user', userSchema);

module.exports = User;