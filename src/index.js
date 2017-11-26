

Object.defineProperty(exports, '__esModule', {
  value: true,
});

const markProps = require('./markProps.js');

module.exports = markProps.default;
exports.default = markProps;

for (const prop in markProps) { // eslint-disable-line
  if (
    markProps.hasOwnProperty(prop) // eslint-disable-line
    && prop !== 'default'
  ) {
    module.exports[prop] = markProps[prop];
    exports[prop] = markProps[prop];
  }
}
