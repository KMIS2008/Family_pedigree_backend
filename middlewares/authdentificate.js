const jwt =require('jsonwebtoken');
const HttpError = require('../helpers/HttpError');
const User = require('../model/users');

const dotenv = require('dotenv');
dotenv.config();

const {SECRET_KEY} = process.env;

const authdentificate = async (req, res, next) => {
    console.log(SECRET_KEY)
    const {authorization = ""} = req.headers;
    const [ bearer, token] = authorization.split(" ");
    if(bearer !== 'Bearer'){
        next(HttpError(401, 'Not authorized'))
    }
    try {
        const { id } = jwt.verify(token, SECRET_KEY);
        console.log(SECRET_KEY)
        const user = await User.findById(id);
        if(!user || !user.token || user.token !== token){
            next(HttpError(401, 'Not authorized')) 
        }
        req.user = user;
        next()
    } catch {
        next(HttpError(401, 'Not authorized'))
    }

}

module.exports = authdentificate;