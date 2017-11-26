const MARKING = Symbol('formation');

function objectOrFunction(target) {
  const typeOf = typeof target;
  return (
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
  if (!prevFormation) {
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

function getMarking(object) {
  return object[MARKING] || [];
}

function markProps(object, initialFormation) {
  const cache = {};

  if (!objectOrFunction(object)) {
    throw new TypeError(`Proxy marker expects an object, ${typeof object} given`);
  }

  let marking;

  const proxiedObject = new Proxy(object, {
    get(target, name) {
      const origin = target[name];

      if (name === MARKING) {
        return marking;
      }

      if (objectOrFunction(origin)) {
        if (!cache[name]) {
          cache[name] = markProps(origin, extend(initialFormation, {
            name,
            type: typeof origin,
          }));
        }
        return cache[name];
      }
      return origin;
    },
    set(target, name, value) {
      if (name === MARKING) {
        return false;
      }
      target[name] = value;

      return true;
    },
    apply(target, context, args) {
      const result = target.apply(context, args);

      if (objectOrFunction(result)) {
        return markProps(result, extend(initialFormation, {
          args,
          resultType: typeof result,
        }));
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
