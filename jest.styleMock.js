// Мок для CSS/SCSS модулей в тестах
// Возвращает имя класса как значение
module.exports = new Proxy({}, {
  get: (target, prop) => prop,
});