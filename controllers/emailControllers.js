const  sgMail = require('@sendgrid/mail');
require('dotenv').config();


const {SENGRINE_API_KEY} = process.env;
sgMail.setApiKey(SENGRINE_API_KEY);

const sendServices = async(req, res, next)=>{
    const { type, fullName, email, phone } = req.body;

    try {
    // Формирование письма
    const msg = {
      // to: "ocu.petropavlivske@gmail.com", // Кому отправить
      to: "lion.irisha@gmail.com", // Кому отправить
      from: "lion.irisha@ukr.net", // Укажите вашу подтвержденную почту SendGrid
      subject: "Запит послуги",
      text: `
        Тип послуги: ${type}
        Ім'я: ${fullName}
        Електронна пошта: ${email}
        Телефон: ${phone || "Не вказано"}
      `,
      html: `
        <p><strong>Тип послуги:</strong> ${type}</p>
        <p><strong>Ім'я:</strong> ${fullName}</p>
        <p><strong>Електронна пошта:</strong> ${email}</p>
        <p><strong>Телефон:</strong> ${phone || "Не вказано"}</p>
      `,
    };
     // Отправка письма через SendGrid
     await sgMail.send(msg);

     res.status(200).send("Письмо успешно отправлено");
   } catch (error) {
     console.error("Ошибка при отправке письма:", error);
     res.status(500).send("Ошибка при отправке письма");
   }
   
    // res.status(201).json(newContact);
}

// module.exports = {
//   sendServices: ctrlWrapper(sendServices),
// }

module.exports={sendServices};