import { extractKeyPrefix } from './util';
export const defaultEnvironmentVariablePrefix = 'CDK_CONTEXT_';

/**
 * Extracts environment variables with given prefix (or default CDK_CONTEXT_) and return them as an object where
 * the keys are the environment variable names without the prefix.
 *
 * @param prefix is the environment name prefix; default: CDK_CONTEXT_
 * @returns Object of environment variables
 */
export const extractEnvironmentVariables = (prefix?: string): Record<string, string> => {
  const env = (process.env as { [obj: string]: string | undefined }) as Record<string, string>;
  return extractKeyPrefix(env, prefix ?? defaultEnvironmentVariablePrefix, true);
};
