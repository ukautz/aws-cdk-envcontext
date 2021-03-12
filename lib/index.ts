import * as cdk from '@aws-cdk/core';

export const defaultEnvPrefix = 'CDK_CONTEXT_';

export interface AppProps extends cdk.AppProps {
  /**
   * Prefix for environment variables that are to be translated into context variables
   *
   * @default CDK_CONTEXT_
   */
  contextEnvPrefix?: string;
}

/**
 * Ann app that extracts context from environment variables.
 *
 * Limitation: CDK internal context keys like "@aws-cdk/core:bootstrapQualifier" cannot be provided
 * due to character limitations of environment variable names, which are: `[a-zA-Z_][a-zA-Z0-9_]*`
 * Could be solved with intermediate base64 encoding, but seems like too much complexity in usage,
 * for cases that could (and should?) be used via `cdk.json` or `cdk.context.json` and likely also
 * better `--context` because this is a highly framework specific.
 *
 * Per default any `CDK_CONTEXT_` prefixed environment variable will be added to context (prefix will be
 * removed in context name and can be set at all)
 */
export class App extends cdk.App {
  constructor(props: AppProps = {}) {
    super({
      ...props,
      context: {
        ...props.context,
        ...extractEnvironmentVariables(props.contextEnvPrefix),
      },
    });
  }
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
  const idx = prefix.length;
  const entries = Object.entries(process.env)
    .filter((env) => env[0].startsWith(prefix as string))
    .map((env) => [env[0].substr(idx), env[1]]);
  return Object.fromEntries(entries);
}
