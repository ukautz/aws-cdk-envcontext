import { extractKeyPrefix } from '../lib/util';

/*
 * Example test
 */
describe('Util', () => {
  describe('withKeyPrefix', () => {
    const vars = { foo: 'foo', bar: 'BAR', prefixFoo: 'FOO', prefixBar: 'bar' };
    it('Keeps all with empty prefix', () => {
      expect(extractKeyPrefix(vars, '')).toEqual(vars);
    });
    it('Keep only with prefix', () => {
      expect(extractKeyPrefix(vars, 'prefix')).toEqual({ prefixFoo: 'FOO', prefixBar: 'bar' });
    });
    it('Trims away prefix', () => {
      expect(extractKeyPrefix(vars, 'prefix', true)).toEqual({ Foo: 'FOO', Bar: 'bar' });
    });
  });
});
