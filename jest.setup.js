// Настройки для тестирования
require('@testing-library/jest-dom');

// Мок для ReactDOM.createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));