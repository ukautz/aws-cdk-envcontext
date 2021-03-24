import { extractEnvironmentVariables } from '../lib';
import { Environment } from '../lib/environment';

/*
 * Example test
 */
describe('Environment', () => {
  const env = new Environment({
    foo: 'foo',
    bar: 'BAR',
  });
  test('missing', () => {
    expect(env.missing()).toEqual([]);
    expect(env.missing('baz')).toEqual(['baz']);
    expect(env.missing('foo', 'bar', 'baz')).toEqual(['baz']);
    expect(env.missing('foo', 'bar')).toEqual([]);
  });
  test('require', () => {
    expect(() => env.require()).not.toThrow();
    expect(() => env.require('baz')).toThrowError();
    expect(() => env.require('foo', 'bar', 'baz')).toThrowError();
    expect(() => env.require('foo', 'bar')).not.toThrow();
  });
  test('must', () => {
    expect(() => env.must('foo')).not.toThrow();
    expect(() => env.must('bar')).not.toThrow();
    expect(() => env.must('baz')).toThrowError();
    expect(() => env.must('fooo')).toThrowError();
  });
  test('may', () => {
    expect(env.may('foo')).toEqual('foo');
    expect(env.may('foo', 'bla')).toEqual('foo');
    expect(env.may('bar')).toEqual('BAR');
    expect(env.may('baz')).toBeUndefined();
    expect(env.may('baz', 'bla')).toEqual('bla');
  });
  test('all', () => {
    expect(env.all()).toEqual({ foo: 'foo', bar: 'BAR' });
    expect(env.all([], { foo: 'xxx' })).toEqual({ foo: 'foo', bar: 'BAR' });
    expect(env.all([], { foo2: 'xxx' })).toEqual({ foo: 'foo', foo2: 'xxx', bar: 'BAR' });
    expect(() => env.all(['foo'], { foo2: 'xxx' })).not.toThrow();
    expect(() => env.all(['foo', 'foo2'], { foo2: 'xxx' })).not.toThrow();
    expect(() => env.all(['foo', 'foo2', 'bar'], { foo2: 'xxx' })).not.toThrow();
    expect(() => env.all(['foo', 'foo2', 'bar', 'baz'], { foo2: 'xxx' })).toThrowError();
    expect(() => env.all(['baz'], { foo2: 'xxx' })).toThrowError();
  });
});
