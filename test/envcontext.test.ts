import { expect as expectCDK, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { App, extractEnvironmentVariables } from '../lib/index';

class ExampleStack extends cdk.Stack {
  public readonly state: string;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.state = `${this.node.tryGetContext('foo')}-${this.node.tryGetContext('bar')}`;
  }
}

/*
 * Example test
 */
describe('EnvContext', () => {
  describe('Environment variables are extracted', () => {
    it('Uses default prefix, if non is specified', () => {
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

    it('Uses specified custom prefix', () => {
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

  describe('App provides context from environment variables', () => {
    process.env['__TEST_APPLY_CONTEXT_foo'] = 'foo';
    process.env['__TEST_APPLY_CONTEXT_bar'] = 'BAR';
    const app = new App({
      contextEnvPrefix: '__TEST_APPLY_CONTEXT_',
    });
    test('Env var context is available from App', () => {
      expect(app.node.tryGetContext('foo')).toEqual('foo');
      expect(app.node.tryGetContext('bar')).toEqual('BAR');
    });
    test('Env var context is available to children', () => {
      const stack = new ExampleStack(app, 'ExampleStack');
      expect(stack.state).toEqual('foo-BAR');
    });
  });
});
