import * as cdk from '@aws-cdk/core';

/**
 * Returns named context value or throws error if missing
 *
 * @param scope
 * @param name
 * @returns
 */
export const mustContext = (scope: cdk.Construct, name: string): string => {
  const value = scope.node.tryGetContext(name);
  if (!value) throw new Error(`Missing context ${name}`);
  return value as string;
};

/**
 * Returns named context value or default or undefined
 *
 * @param scope
 * @param name
 * @param defaultValue
 * @returns
 */
export const mayContext = (scope: cdk.Construct, name: string, defaultValue?: string): string | undefined =>
  scope.node.tryGetContext(name) ?? defaultValue;

/**
 * Alternative interface for context access
 */
export class Context {
  /**
   *
   * @param scope
   */
  constructor(public readonly scope: cdk.Construct) {}

  public must = (name: string): string => mustContext(this.scope, name);
  public may = (name: string, defaultValue?: string): string | undefined => mayContext(this.scope, name, defaultValue);
}

export const contextOf = (scope: cdk.Construct): Context => new Context(scope);
