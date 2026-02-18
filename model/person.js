const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const personSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: ''
  },
  
  lastName: {
    type: String,
    trim: true,
    default: ''
  },
  
  middleName: {
    type: String,
    trim: true,
    default: ''
  },
  
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'Стать є обов\'язковою']
  },
  
  birthDate: {
    type: Date,
    default: null,
    validate: {
      validator: function(value) {
        if (!value) return true;
        return value <= new Date();
      },
      message: 'Дата народження не може бути в майбутньому'
    }
  },
  
  deathDate: {
    type: Date,
    default: null,
    validate: {
      validator: function(value) {
        if (!value || !this.birthDate) return true;
        return value > this.birthDate;
      },
      message: 'Дата смерті не може бути раніше дати народження'
    }
  },
  
  comments: {
    type: String,
    maxlength: [1000, 'Коментар не може перевищувати 1000 символів'],
    default: ''
  }
  
}, {
  timestamps: true  // автоматично додає createdAt та updatedAt
});

// ========================================
// МЕТОДИ МОДЕЛІ
// ========================================

// Метод для отримання повного імені
personSchema.methods.getFullName = function() {
  const parts = [this.lastName, this.firstName, this.middleName].filter(Boolean);
  return parts.join(' ') || 'Без імені';
};

// Метод для перевірки, чи жива особа
personSchema.methods.isAlive = function() {
  return !this.deathDate;
};

// Метод для отримання віку
personSchema.methods.getAge = function() {
  if (!this.birthDate) return null;
  
  const endDate = this.deathDate || new Date();
  const age = endDate.getFullYear() - this.birthDate.getFullYear();
  const monthDiff = endDate.getMonth() - this.birthDate.getMonth();
  
  // Корректировка возраста, если день рождения ещё не наступил в этом году
  if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < this.birthDate.getDate())) {
    return age - 1;
  }
  
  return age;
};

// Метод для отримання інформації про життя
personSchema.methods.getLifeInfo = function() {
  const birthYear = this.birthDate ? this.birthDate.getFullYear() : null;
  const deathYear = this.deathDate ? this.deathDate.getFullYear() : null;
  
  if (birthYear && deathYear) {
    return `${birthYear} - ${deathYear}`;
  } else if (birthYear) {
    return `${birthYear} - досі живий`;
  }
  
  return 'Дата народження невідома';
};

// ========================================
// СТАТИЧНІ МЕТОДИ
// ========================================

// Знайти всіх людей за статтю
personSchema.statics.findByGender = function(gender) {
  return this.find({ gender });
};

// Знайти всіх живих людей
personSchema.statics.findAlive = function() {
  return this.find({ deathDate: null });
};

// Знайти померлих людей
personSchema.statics.findDeceased = function() {
  return this.find({ deathDate: { $ne: null } });
};

// Пошук за повним іменем
personSchema.statics.searchByName = function(searchTerm) {
  const regex = new RegExp(searchTerm, 'i'); // регістронезалежний пошук
  
  return this.find({
    $or: [
      { firstName: regex },
      { lastName: regex },
      { middleName: regex }
    ]
  });
};

// ========================================
// ВІРТУАЛЬНІ ПОЛЯ
// ========================================

// Віртуальне поле для повного імені
personSchema.virtual('fullName').get(function() {
  return this.getFullName();
});

// Віртуальне поле для віку
personSchema.virtual('age').get(function() {
  return this.getAge();
});

// Увімкнути віртуальні поля в JSON
personSchema.set('toJSON', { virtuals: true });
personSchema.set('toObject', { virtuals: true });

// ========================================
// ІНДЕКСИ ДЛЯ ОПТИМІЗАЦІЇ ЗАПИТІВ
// ========================================

personSchema.index({ lastName: 1, firstName: 1 });
personSchema.index({ gender: 1 });
personSchema.index({ birthDate: 1 });
personSchema.index({ deathDate: 1 });

// Текстовий індекс для пошуку
personSchema.index({
  firstName: 'text',
  lastName: 'text',
  middleName: 'text'
});

const Person = model('Person', personSchema);

module.exports = Person;




// const mongoose = require('mongoose');
// const { Schema, model } = mongoose;

// const personSchema = new Schema({
//   firstName: {
//     type: String,
//     trim: true,
//     default: ''
//   },
  
//   lastName: {
//     type: String,
//     trim: true,
//     default: ''
//   },
  
//   middleName: {
//     type: String,
//     trim: true,
//     default: ''
//   },
  
//   gender: {
//     type: String,
//     enum: ['male', 'female'],
//     required: [true, 'Стать є обов\'язковою']
//   },
  
//   birthDate: {
//     type: Date,
//     default: null,
//     validate: {
//       validator: function(value) {
//         if (!value) return true;
//         return value <= new Date();
//       },
//       message: 'Дата народження не може бути в майбутньому'
//     }
//   },
  
//   deathDate: {
//     type: Date,
//     default: null,
//     validate: {
//       validator: function(value) {
//         if (!value || !this.birthDate) return true;
//         return value > this.birthDate;
//       },
//       message: 'Дата смерті не може бути раніше дати народження'
//     }
//   },
  
//   photo: {
//     type: String,
//     default: null
//   },
  
//   comments: {
//     type: String,
//     maxlength: [1000, 'Коментар не може перевищувати 1000 символів'],
//     default: ''
//   },
  
//   // ========================================
//   // ЗВ'ЯЗКИ З РОДИЧАМИ
//   // ========================================
  
//   // Батьки (максимум 2)
//   parents: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Person'
//   }],
  
//   // Подружжя (може бути декілька, якщо були розлучення)
//   spouses: [{
//     personId: {
//       type: Schema.Types.ObjectId,
//       ref: 'Person',
//       required: true
//     },
//     marriageDate: {
//       type: Date,
//       default: Date.now
//     },
//     divorceDate: {
//       type: Date,
//       default: null
//     }
//   }],
  
//   // Діти (автоматично заповнюється при створенні дитини)
//   children: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Person'
//   }]
  
// }, {
//   timestamps: true  // автоматично додає createdAt та updatedAt
// });

// // ========================================
// // ВАЛІДАЦІЯ НА РІВНІ СХЕМИ
// // ========================================

// // Перевірка: максимум 2 батьки
// personSchema.path('parents').validate(function(value) {
//   return value.length <= 2;
// }, 'Особа може мати максимум 2 батьків');

// // ========================================
// // МЕТОДИ МОДЕЛІ
// // ========================================

// // Метод для отримання повного імені
// personSchema.methods.getFullName = function() {
//   const parts = [this.lastName, this.firstName, this.middleName].filter(Boolean);
//   return parts.join(' ') || 'Без імені';
// };

// // Метод для перевірки, чи жива особа
// personSchema.methods.isAlive = function() {
//   return !this.deathDate;
// };

// // Метод для отримання віку
// personSchema.methods.getAge = function() {
//   if (!this.birthDate) return null;
  
//   const endDate = this.deathDate || new Date();
//   const age = endDate.getFullYear() - this.birthDate.getFullYear();
  
//   return age;
// };

// // Метод для отримання поточного подружжя
// personSchema.methods.getCurrentSpouse = async function() {
//   const currentMarriage = this.spouses.find(s => !s.divorceDate);
  
//   if (!currentMarriage) return null;
  
//   return await mongoose.model('Person').findById(currentMarriage.personId);
// };

// // ========================================
// // СТАТИЧНІ МЕТОДИ
// // ========================================

// // Знайти всіх нащадків особи
// personSchema.statics.findDescendants = async function(personId) {
//   const person = await this.findById(personId).populate('children');
//   if (!person) return [];
  
//   let descendants = [...person.children];
  
//   for (const child of person.children) {
//     const childDescendants = await this.findDescendants(child._id);
//     descendants = descendants.concat(childDescendants);
//   }
  
//   return descendants;
// };

// // Знайти всіх предків особи
// personSchema.statics.findAncestors = async function(personId) {
//   const person = await this.findById(personId).populate('parents');
//   if (!person || person.parents.length === 0) return [];
  
//   let ancestors = [...person.parents];
  
//   for (const parent of person.parents) {
//     const parentAncestors = await this.findAncestors(parent._id);
//     ancestors = ancestors.concat(parentAncestors);
//   }
  
//   return ancestors;
// };

// // ========================================
// // HOOKS (middleware)
// // ========================================

// // Перед збереженням: перевіряємо циклічні зв'язки
// personSchema.pre('save', async function(next) {
//   if (this.isNew || this.isModified('parents')) {
//     // Перевіряємо, що особа не є своїм власним предком
//     if (this.parents.includes(this._id)) {
//       throw new Error('Особа не може бути власним батьком/матір\'ю');
//     }
//   }
  
//   next();
// });

// // ========================================
// // ІНДЕКСИ ДЛЯ ОПТИМІЗАЦІЇ ЗАПИТІВ
// // ========================================

// personSchema.index({ parents: 1 });
// personSchema.index({ 'spouses.personId': 1 });
// personSchema.index({ children: 1 });
// personSchema.index({ gender: 1 });
// personSchema.index({ birthDate: 1 });
// personSchema.index({ lastName: 1, firstName: 1 });

// const Person = model('Person', personSchema);

// module.exports = Person;