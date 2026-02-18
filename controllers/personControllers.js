const Person = require('../model/person');
const ctrlWrapper = require('../helpers/ctrlWrapper');


// GET: Отримати всіх людей
const getAllPersons = async (req, res) => {
  const people = await Person.find()
    .populate('parents', 'firstName lastName gender birthDate')
    .populate('spouses.personId', 'firstName lastName gender birthDate')
    .populate('children', 'firstName lastName gender birthDate')
    .sort({ lastName: 1, firstName: 1 });
  
  res.json({
    success: true,
    count: people.length,
    data: people
  });
};

// GET: Отримати одну особу за ID
const getPersonById = async (req, res) => {
  const person = await Person.findById(req.params.id)
    .populate('parents')
    .populate('spouses.personId')
    .populate('children');
  
  if (!person) {
    return res.status(404).json({
      success: false,
      message: 'Особу не знайдено'
    });
  }
  
  res.json({
    success: true,
    data: person
  });
};

// POST: Створити нову особу
const createPerson = async (req, res) => {
  const personData = {
    ...req.validatedData,
    photo: req.file ? `/uploads/photos/${req.file.filename}` : null
  };
  
  // Створюємо масив батьків
  const parents = [];
  if (personData.parent1) parents.push(personData.parent1);
  if (personData.parent2) parents.push(personData.parent2);
  
  // Створюємо особу
  const person = new Person({
    ...personData,
    parents,
    spouses: [],
    children: []
  });
  
  await person.save();
  
  // Додаємо цю особу в масив children батьків
  if (parents.length > 0) {
    await Person.updateMany(
      { _id: { $in: parents } },
      { $addToSet: { children: person._id } }
    );
  }
  
  // Якщо вказано подружжя - створюємо двосторонній зв'язок
  if (personData.spouse) {
    await createMarriageLink(person._id, personData.spouse);
  }
  
  // Повертаємо створену особу з заповненими зв'язками
  const populatedPerson = await Person.findById(person._id)
    .populate('parents')
    .populate('spouses.personId')
    .populate('children');
  
  res.status(201).json({
    success: true,
    message: 'Особу успішно додано',
    data: populatedPerson
  });
};

// PUT: Оновити дані особи
const updatePerson = async (req, res) => {
  const person = await Person.findById(req.params.id);
  
  if (!person) {
    return res.status(404).json({
      success: false,
      message: 'Особу не знайдено'
    });
  }
  
  const updateData = {
    ...req.validatedData
  };
  
  // Якщо завантажено нове фото
  if (req.file) {
    updateData.photo = `/uploads/photos/${req.file.filename}`;
  }
  
  // Оновлюємо батьків
  const oldParents = person.parents.map(p => p.toString());
  const newParents = [];
  if (updateData.parent1) newParents.push(updateData.parent1);
  if (updateData.parent2) newParents.push(updateData.parent2);
  
  updateData.parents = newParents;
  
  // Видаляємо зі старих батьків
  const parentsToRemove = oldParents.filter(p => !newParents.includes(p));
  if (parentsToRemove.length > 0) {
    await Person.updateMany(
      { _id: { $in: parentsToRemove } },
      { $pull: { children: person._id } }
    );
  }
  
  // Додаємо до нових батьків
  const parentsToAdd = newParents.filter(p => !oldParents.includes(p));
  if (parentsToAdd.length > 0) {
    await Person.updateMany(
      { _id: { $in: parentsToAdd } },
      { $addToSet: { children: person._id } }
    );
  }
  
  // Оновлюємо подружжя
  if (updateData.spouse && updateData.spouse !== person.spouses[0]?.personId?.toString()) {
    // Видаляємо старі зв'язки
    await removeAllMarriageLinks(person._id);
    
    // Створюємо новий зв'язок
    await createMarriageLink(person._id, updateData.spouse);
  }
  
  // Оновлюємо особу
  Object.assign(person, updateData);
  await person.save();
  
  const updatedPerson = await Person.findById(person._id)
    .populate('parents')
    .populate('spouses.personId')
    .populate('children');
  
  res.json({
    success: true,
    message: 'Дані успішно оновлено',
    data: updatedPerson
  });
};

// DELETE: Видалити особу
const deletePerson = async (req, res) => {
  const person = await Person.findById(req.params.id);
  
  if (!person) {
    return res.status(404).json({
      success: false,
      message: 'Особу не знайдено'
    });
  }
  
  // Видаляємо зі списку children батьків
  if (person.parents.length > 0) {
    await Person.updateMany(
      { _id: { $in: person.parents } },
      { $pull: { children: person._id } }
    );
  }
  
  // Видаляємо зв'язки подружжя
  await removeAllMarriageLinks(person._id);
  
  // Видаляємо особу
  await person.deleteOne();
  
  res.json({
    success: true,
    message: 'Особу успішно видалено'
  });
};

// ========================================
// ДОДАТКОВІ ОПЕРАЦІЇ
// ========================================

// GET: Отримати генеалогічне дерево
const getFamilyTree = async (req, res) => {
  const person = await Person.findById(req.params.id);
  
  if (!person) {
    return res.status(404).json({
      success: false,
      message: 'Особу не знайдено'
    });
  }
  
  const ancestors = await Person.findAncestors(person._id);
  const descendants = await Person.findDescendants(person._id);
  
  res.json({
    success: true,
    data: {
      person,
      ancestors,
      descendants
    }
  });
};

// ========================================
// ДОПОМІЖНІ ФУНКЦІЇ
// ========================================

// Створити двосторонній зв'язок подружжя
async function createMarriageLink(person1Id, person2Id, marriageDate = new Date()) {
  await Person.updateOne(
    { _id: person1Id },
    {
      $push: {
        spouses: {
          personId: person2Id,
          marriageDate,
          divorceDate: null
        }
      }
    }
  );
  
  await Person.updateOne(
    { _id: person2Id },
    {
      $push: {
        spouses: {
          personId: person1Id,
          marriageDate,
          divorceDate: null
        }
      }
    }
  );
}

// Видалити всі зв'язки подружжя для особи
async function removeAllMarriageLinks(personId) {
  const person = await Person.findById(personId);
  
  if (person && person.spouses.length > 0) {
    // Видаляємо зв'язки у подружжя
    for (const spouse of person.spouses) {
      await Person.updateOne(
        { _id: spouse.personId },
        { $pull: { spouses: { personId: personId } } }
      );
    }
    
    // Очищаємо масив подружжя
    person.spouses = [];
    await person.save();
  }
}

// ========================================
// ЕКСПОРТ З ОБГОРТАННЯМ
// ========================================

module.exports = {
  getAllPersons: ctrlWrapper(getAllPersons),
  getPersonById: ctrlWrapper(getPersonById),
  createPerson: ctrlWrapper(createPerson),
  updatePerson: ctrlWrapper(updatePerson),
  deletePerson: ctrlWrapper(deletePerson),
  getFamilyTree: ctrlWrapper(getFamilyTree)
};