mark-props
==

Wrap an object with [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) in such way, when any gotten property or a created property will have the information about the path of its getting.

For example:
```js
import markProps, { getMarking } from 'mark-props';
import PropTypes from 'prop-types';

const MarkedPropTypes = markProps(PropTypes);

const propType = MarkedPropTypes.shape({
  enabled: MarkedPropTypes.bool,
}).isRequired;


console.log(
  getMarking(propType)
);
// Result will:
// [
//   {
//     name: 'shape',
//     type: 'function',
//     args: [{
//       enabled: ⨍ function() { ... }
//     }]
//   },
//   {
//     name: 'isRequired',
//     type: 'function'
//   }
// ]

const [ firstArgOfShape ] = getMarking(propType)[0].args;

console.log(
  getMarking(firstArgOfShape)
);
// Result will:
// [
//   {
//     name: 'bool',
//     type: 'function'
//   }
// ]
```

This tool created especially for [PropTypes](https://www.npmjs.com/package/prop-types) marking, but you can use it with any object.

Author
----

Vladimir Kalmykov <vladimirmorulus@gmail.com>

License
----

MIT, 2017
