const  sgMail = require('@sendgrid/mail');
require('dotenv').config();

const {SENGRINE_API_KEY} = process.env;
sgMail.setApiKey(SENGRINE_API_KEY);

const sendEmail = async(data)=>{
    const email = {...data, from: "postpostqwe@gmail.com"};
    await sgMail.send(email);
    return true;
}

module.exports = sendEmail;