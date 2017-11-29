import OriginPropTypes from 'prop-types';
import markProps, { getMarking } from './src';

describe('mark-props with PropTypes', () => {
  const PropTypes = markProps(OriginPropTypes);
  it('PropTypes.node', () => {
    const node = PropTypes.node;
    expect(getMarking(node)).toMatchObject([{ name: 'node' }]);
  });

  it('PropTypes.node memory leak', () => {
    const node = PropTypes.node;
    const node2 = PropTypes.node;
    expect(getMarking(node)).toBe(getMarking(node2));
  });

  it('PropTypes.node immutable to origin', () => {
    const node = PropTypes.node;
    const node2 = OriginPropTypes.node;
    expect(getMarking(node)).not.toBe(getMarking(node2));
    expect(getMarking(node2)).toMatchObject([]);
    expect(getMarking(node2).length).toBe(0);
  });

  it('PropTypes.node.isRequired', () => {
    const node = PropTypes.node.isRequired;
    expect(getMarking(node)).toMatchObject([
      { name: 'node' },
      { name: 'isRequired' },
    ]);
  });

  it('PropTypes.shape', () => {
    const bool = PropTypes.bool;
    const node = PropTypes.shape({
      a: bool,
    });
    expect(getMarking(node)).toMatchObject([
      { name: 'shape',
        args: [{
          a: bool,
        }],
      },
    ]);
  });

  it('PropTypes.shape.isRequired', () => {
    const bool = PropTypes.bool;
    const node = PropTypes.shape({
      a: bool,
    }).isRequired;
    expect(getMarking(node)).toMatchObject([
      { name: 'shape',
        args: [{
          a: bool,
        }],
      },
      {
        name: 'isRequired',
        type: 'function',
      },
    ]);
  });
});

describe('mark-props with PropTypes', () => {
  it('Various object', () => {
    const SomeShape = markProps({
      a: {
        b: {
          c: () => ({
            d: 1,
          }),
        },
      },
    });
    const c = SomeShape.a.b.c('C');
    expect(getMarking(c)).toMatchObject([
      {
        name: 'a',
        type: 'object',
      },
      {
        name: 'b',
        type: 'object',
      },
      {
        name: 'c',
        type: 'function',
        args: ['C'],
      },
    ]);
  });
});

describe('mark-props with custom marker', () => {
  it('default', () => {
    const CUSTOM_MARKING = Symbol('test');
    const SomeShape = markProps({
      a: {
        b: {
          c: () => ({
            d: 1,
          }),
        },
      },
    }, [], CUSTOM_MARKING);
    const c = SomeShape.a.b.c('C');

    expect(getMarking(c)).not.toMatchObject([
      {
        name: 'a',
        type: 'object',
      },
      {
        name: 'b',
        type: 'object',
      },
      {
        name: 'c',
        type: 'function',
        args: ['C'],
      },
    ]);

    expect(getMarking(c, CUSTOM_MARKING)).toMatchObject([
      {
        name: 'a',
        type: 'object',
      },
      {
        name: 'b',
        type: 'object',
      },
      {
        name: 'c',
        type: 'function',
        args: ['C'],
      },
    ]);
  });
});

describe('coverage', () => {
  it('set', () => {
    const SomeShape = markProps({
      a: {
        b: {
          c: () => ({
            d: 1,
          }),
        },
      },
    }, []);

    SomeShape.a.x = 13;
    expect(SomeShape.a.x).toBe(13);

    SomeShape.a.x = () => {};
    expect(typeof SomeShape.a.x).toBe('function');

    const x = SomeShape.a.x;
    expect(getMarking(x)).toMatchObject([
      {
        name: 'a',
        type: 'object',
      },
      {
        name: 'x',
        type: 'function',
      },
    ]);
  });

  it('fail on set marking key', () => {
    const CUSTOM_MARKING = Symbol('test');
    const SomeShape = markProps({
      a: {},
    }, [], CUSTOM_MARKING);

    function throwable() {
      SomeShape[CUSTOM_MARKING] = false;
    }

    expect(throwable).toThrow();
  });

  it('pass false object', () => {
    function throwable1() {
      markProps(null);
    }
    function throwable2() {
      markProps();
    }
    expect(throwable1).toThrow();
    expect(throwable2).toThrow();
  });

  it('return non-object result', () => {
    const SomeShape = markProps({
      a: () => 'mark-props',
    }, []);

    expect(SomeShape.a()).toBe('mark-props');
  });
});
