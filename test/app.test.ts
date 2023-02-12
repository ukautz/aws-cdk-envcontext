import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { App } from '../lib';

class ContextExampleStack extends cdk.Stack {
  public readonly state: string;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const foo = this.node.tryGetContext('foo') ?? 'undefined';
    const bar = this.node.tryGetContext('bar') ?? 'undefined';
    this.state = `foo=${foo}, bar=${bar}`;
  }
}

/*
 * Example test
 */
describe('App', () => {
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
    const stack = new ContextExampleStack(app, 'ContextExampleStack');
    expect(stack.state).toEqual('foo=foo, bar=BAR');
  });
});
