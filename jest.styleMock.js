// Мок для CSS/SCSS модулей в тестах
// Возвращает имя класса как значение для совместимости с classnames
module.exports = new Proxy(
  {},
  {
    get: (target, prop) => {
      // Возвращаем имя свойства как строку
      return String(prop);
    },
  }
);