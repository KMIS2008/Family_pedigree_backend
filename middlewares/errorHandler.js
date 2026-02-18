// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('❌ Помилка:', err.stack);
  
  // Помилка Multer (завантаження файлів)
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Файл занадто великий (макс. 5MB)'
      });
    }
  }
  
  // Помилка валідації Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Помилка валідації',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // Помилка CastError (невірний ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Невірний формат ID'
    });
  }
  
  // Загальна помилка сервера
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Щось пішло не так!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;