const Joi = require('joi');

// Схема для создания/обновления персоны
const personSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .optional()
    .allow(''),
  
  lastName: Joi.string()
    .trim()
    .optional()
    .allow(''),
  
  middleName: Joi.string()
    .trim()
    .optional()
    .allow(''),
  
  gender: Joi.string()
    .valid('male', 'female')
    .required()
    .messages({
      'any.required': 'Стать є обов\'язковою',
      'any.only': 'Стать має бути "male" або "female"'
    }),
  
  birthDate: Joi.date()
    .max('now')
    .optional()
    .allow(null, '')
    .messages({
      'date.max': 'Дата народження не може бути в майбутньому'
    }),
  
  deathDate: Joi.date()
    .greater(Joi.ref('birthDate'))
    .optional()
    .allow(null, '')
    .messages({
      'date.greater': 'Дата смерті не може бути раніше дати народження'
    }),
  
  // Зв'язки з батьками
  parent1: Joi.string()
    .optional()
    .allow(null, ''),
  
  parent2: Joi.string()
    .optional()
    .allow(null, '')
    .when('parent1', {
      is: Joi.exist(),
      then: Joi.string().invalid(Joi.ref('parent1'))
        .messages({
          'any.invalid': 'Батько/мати 2 не може бути тим самим, що й батько/мати 1'
        })
    }),
  
  // Зв'язок з подружжям
  spouse: Joi.string()
    .optional()
    .allow(null, ''),
  
  // Фото (валідація на фронтенді, тут перевіряємо URL або шлях)
  photo: Joi.string()
    .uri()
    .optional()
    .allow(null, ''),
  
  comments: Joi.string()
    .max(1000)
    .optional()
    .allow('', null)
    .messages({
      'string.max': 'Коментар не може перевищувати 1000 символів'
    })
});

// Схема для створення шлюбу між двома людьми
const marriageSchema = Joi.object({
  person1Id: Joi.string()
    .required()
    .messages({
      'any.required': 'ID першої особи обов\'язкове'
    }),
  
  person2Id: Joi.string()
    .required()
    .invalid(Joi.ref('person1Id'))
    .messages({
      'any.required': 'ID другої особи обов\'язкове',
      'any.invalid': 'Особа не може одружитися сама з собою',
    }),
  
  marriageDate: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.max': 'Дата шлюбу не може бути в майбутньому'
    }),
  
  divorceDate: Joi.date()
    .greater(Joi.ref('marriageDate'))
    .optional()
    .allow(null)
    .messages({
      'date.greater': 'Дата розлучення не може бути раніше дати шлюбу'
    })
});

module.exports = {
  personSchema,
  marriageSchema
};