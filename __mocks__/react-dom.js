const ReactDOM = jest.requireActual('react-dom');

module.exports = {
  ...ReactDOM,
  createPortal: (node) => node,
};