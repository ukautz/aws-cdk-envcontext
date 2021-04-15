import { extractEnvironmentVariables } from '../lib/environment';

/*
 * Example test
 */
describe('Environment', () => {
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
