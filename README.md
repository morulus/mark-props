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

# Useful with babel

Use  [babel-plugin-module-resolver](https://github.com/tleunen/babel-plugin-module-resolver) to wrap, for example, `prop-types` module globally:

```js
// marked-prop-types.js
const PropTypes = require('origin-prop-types');
const markProps = require('mark-props');

module.exports = markProps(PropTypes);
```

```js
// Babel configuration
{
  "plugins": [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        "alias": {
          "origin-prop-types": require.resolve("prop-types"),
          "prop-types": require.resolve("./marked-prop-types.js"),
        }
      }
    ]
  ]
}
```

Thus, all PropTypes in a project will be wrapped with `mark-props`.

```js
import PropTypes from 'prop-types';
import { getMarking } from 'mark-props';

const propTypes = {
  children: PropTypes.node.isRequired,
};

getMarking(propTypes.children); // [{ name: 'node' }, { name: 'isRequired' }]

```

Author
----

Vladimir Kalmykov <vladimirmorulus@gmail.com>

License
----

MIT, 2017
