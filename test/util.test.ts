import { extractEnvironmentVariables } from '../lib';
import { withKeyPrefix } from '../lib/util';

/*
 * Example test
 */
describe('Util', () => {
  describe('withKeyPrefix', () => {
    const vars = { foo: 'foo', bar: 'BAR', prefixFoo: 'FOO', prefixBar: 'bar' };
    it('Keeps all with empty prefix', () => {
      expect(withKeyPrefix(vars, '')).toEqual(vars);
    });
    it('Keep only with prefix', () => {
      expect(withKeyPrefix(vars, 'prefix')).toEqual({ prefixFoo: 'FOO', prefixBar: 'bar' });
    });
    it('Trims away prefix', () => {
      expect(withKeyPrefix(vars, 'prefix', true)).toEqual({ Foo: 'FOO', Bar: 'bar' });
    });
  });
  describe('extractEnvironmentVariables', () => {
    it('Extracts using defaults', () => {
      process.env['CDK_CONTEXT_foo'] = 'foo';
      process.env['CDK_CONTEXT_bar'] = 'BAR';
      process.env['CDK_CONTEXT_BAZZOING'] = 'bazzoing';
      process.env['CDK_CONTEXT___BAZING444'] = 'BAZING';

      const envs = extractEnvironmentVariables();
      expect(envs).toEqual({
        foo: 'foo',
        bar: 'BAR',
        BAZZOING: 'bazzoing',
        __BAZING444: 'BAZING',
      });
    });
    it('Extracts using specific syntax', () => {
      process.env['__WHATEVER__foo'] = 'foo';
      process.env['__WHATEVER__bar'] = 'BAR';
      process.env['__WHATEVER__BAZZOING'] = 'bazzoing';
      process.env['__WHATEVER____BAZING444'] = 'BAZING';

      const envs = extractEnvironmentVariables('__WHATEVER__');
      expect(envs).toEqual({
        foo: 'foo',
        bar: 'BAR',
        BAZZOING: 'bazzoing',
        __BAZING444: 'BAZING',
      });
    });
  });
});
