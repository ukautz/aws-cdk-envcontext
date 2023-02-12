import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { mayContext, mustContext, Context, contextOf } from '../lib/context';

class ContextualStack extends cdk.Stack {
  public readonly fromContext: string;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const context = contextOf(this);
    this.fromContext = context.must('foo');
  }
}

/*
 * Example test
 */
describe('Context', () => {
  const app = new cdk.App({ context: { foo: 'foo1', bar: 'bar1' } });
  describe('mustContext', () => {
    it('Returns existing context', () => {
      expect(mustContext(app, 'foo')).toEqual('foo1');
      expect(mustContext(app, 'bar')).toEqual('bar1');
    });
    it('Throws error on missing', () => {
      expect(() => {
        mustContext(app, 'baz');
      }).toThrowError();
    });
  });
  describe('mayContext', () => {
    it('Returns existing context', () => {
      expect(mayContext(app, 'foo')).toEqual('foo1');
      expect(mayContext(app, 'bar')).toEqual('bar1');
    });
    it('Returns default value', () => {
      expect(mayContext(app, 'baz', 'fallback')).toEqual('fallback');
    });
  });
  describe('Context', () => {
    const context = new Context(app);
    assertContext(context);
  });
  describe('contextOf', () => {
    const context = contextOf(app);
    assertContext(context);
  });
  describe('contextOf in Stack', () => {
    const stack = new ContextualStack(app, 'Stack');
    expect(stack.fromContext).toEqual('foo1');
  });
});

function assertContext(context: Context) {
  it('Must return existing', () => {
    expect(context.must('foo')).toEqual('foo1');
    expect(context.may('foo')).toEqual('foo1');
    expect(context.must('bar')).toEqual('bar1');
    expect(context.may('bar')).toEqual('bar1');
  });
  it('Must fail on missing', () => {
    expect(() => {
      context.must('baz');
    }).toThrowError();
  });
  it('Falls back when optional', () => {
    expect(context.may('baz', 'fallback')).toEqual('fallback');
  });
}
