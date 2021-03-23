import { defaultEnvPrefix } from './constant';

/**
 * @param obj Arbitrary key/value
 * @param prefix Prefix to filter object keys by
 * @param trim Whether to remove prefix from keys in returned object
 * @returns Filtered set of key/values
 */
export function withKeyPrefix(obj: Record<string, string>, prefix: string, trim?: boolean): Record<string, string> {
  let entries = Object.entries(obj).filter(([key, value]) => key.startsWith(prefix));
  if (trim) {
    const idx = prefix.length;
    entries = entries.map(([key, value]) => [key.substr(idx), value]);
  }
  return Object.fromEntries(entries);
}

/**
 * Extracts environment variables with given prefix (or default CDK_CONTEXT_) and return them as an object where
 * the keys are the environment variable names without the prefix.
 *
 * @param prefix is the environment name prefix; default: CDK_CONTEXT_
 * @returns Object of environment variables
 */
export function extractEnvironmentVariables(prefix?: string): Record<string, string> {
  if (prefix === undefined) prefix = defaultEnvPrefix;
  const env = (process.env as { [obj: string]: string | undefined }) as Record<string, string>;
  return withKeyPrefix(env, prefix!, true);
}
