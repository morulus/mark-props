import OriginPropTypes from 'prop-types';
import markProps, { getMarking } from './src';

describe('markProps with PropTypes', () => {
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

describe('prop-marker with PropTypes', () => {
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
