const User = require("../model/users");
const bcrypt= require('bcryptjs');
const jwt =require('jsonwebtoken');
const ctrlWrapper = require('../helpers/ctrlWrapper.js');
const sendEmail = require('../helpers/sendEmails.js');
const dotenv = require('dotenv');
dotenv.config();
const Jimp = require('jimp');
const {nanoid} = require('nanoid');

const  {SECRET_KEY} = process.env;
const {BASE_URL} = process.env;
const path = require('path');
const fs=require('fs/promises');

const HttpError = require('../helpers/HttpError.js');


const register = async (req, res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (user){
        throw HttpError(409, "Email in use")
    }

    const hashPasword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();

    const newUser = await User.create({
        ...req.body,
        password: hashPasword,
        verificationToken
    });
     
    res.status(201).json(
       { email: newUser.email,
    });
}


const login = async (req, res)=>{
    const { email, password, 
    } = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw HttpError(401, "Email or password is wrong")
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
        throw HttpError(401, "Email or password is wrong")
    }

    const payload = {
        id: user._id
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
    await User.findByIdAndUpdate(user._id, {token});

    res.status(200).json({
        token,
        user: {
            email: user.email,
          }})
}

   const getCurrent = (req, res)=>{
    const {email, 
    } = req.user;
    res.status(200).json({email, 
    })
   }

   const logout = async (req, res)=>{
    const {_id}= req.user;
    await User.findByIdAndUpdate(_id, {token: null});

    res.json({messege:'Logout success'})
   }

   const upDateAvatar = async(req, res)=>{
    const {_id} = req.user;
    if(!req.file){
        res.status|(400).json({mesege:"No file uploaded"})
    }

    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const img = await Jimp.read(tempUpload);
    await img
      .resize(250, 250)
      .writeAsync(tempUpload);
      
    const resultUpload = path.join(avatarsDir, filename);

    await fs.rename(tempUpload, resultUpload);
    const avatarURL= path.join('avatars', filename);

    await User.findByIdAndUpdate(_id, {avatarURL});
    
    res.status(200).json({
        avatarURL
    });
   }


module.exports = {
    register: ctrlWrapper(register),
    login:ctrlWrapper(login),
    getCurrent:ctrlWrapper(getCurrent),
    logout:ctrlWrapper(logout),
    upDateAvatar:ctrlWrapper(upDateAvatar),
}