// I can not use Symbol as marking key, because there is cases when `mark-props`,
// which hooks and reads are different modules.
const MARKING = '[[mark-props:v0.1.3:2UgY2FuIG9ubHkgc2hvdyB5b3UgdGhlIGRvb3IsIHlvdSdyZSB0aGUgb25lIHdobyBoYXZlIHRvIHdhbGsgdGhyb3VnaCBpdA==]]';

function objectOrFunction(target) {
  const typeOf = typeof target;
  return target !== null && (
    typeOf === 'function'
    || typeOf === 'object'
  );
}

function isArray(f) {
  return typeof f === 'object' && f instanceof Array;
}

function toArray(o) {
  return isArray(o) ? o : [o];
}

function getLastFormation(formations) {
  return formations[formations.length - 1];
}

function extend(prevFormation, nextFormation) {
  if (!prevFormation || (
    isArray(prevFormation) && !prevFormation.length
  )) {
    return toArray(nextFormation);
  }
  const validPrevFormation = toArray(prevFormation);
  const lastFormation = getLastFormation(prevFormation);
  if (
    lastFormation.type === 'function'
    && (lastFormation.name && !lastFormation.args)
    && nextFormation.args
  ) {
    const modifFormation = Object.assign({}, lastFormation, {
      args: nextFormation.args,
    });
    return validPrevFormation.slice(0, validPrevFormation.length - 1).concat([modifFormation]);
  }
  return validPrevFormation.concat(nextFormation);
}

function getMarking(object, marking = MARKING) {
  return object[marking] || [];
}

function markProps(object, initialFormation, markingKey = MARKING) {
  const cache = {};

  if (!objectOrFunction(object)) {
    throw new TypeError(`Proxy marker expects an object, ${typeof object} given`);
  }

  let marking;
  const proxiedObject = new Proxy(object, {
    get(target, name) {
      const origin = target[name];

      if (name === markingKey) {
        return marking;
      }

      if (objectOrFunction(origin)) {
        if (!cache[name]) {
          cache[name] = markProps(origin, extend(initialFormation, {
            name,
            type: typeof origin,
          }), markingKey);
        }
        return cache[name];
      }
      return origin;
    },
    set(target, name, value) {
      if (name === markingKey) {
        return false;
      }
      target[name] = value;
      delete cache[name];

      return true;
    },
    apply(target, context, args) {
      const result = target.apply(context, args);

      if (objectOrFunction(result)) {
        return markProps(result, extend(initialFormation, {
          args,
          resultType: typeof result,
        }), markingKey);
      }
      return result;
    },
  });

  marking = initialFormation;

  return proxiedObject;
}

export {
  getMarking,
  MARKING,
};

export default markProps;
