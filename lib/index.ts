import * as cdk from '@aws-cdk/core';

export const defaultEnvPrefix = 'CDK_CONTEXT_';

export interface AppProps extends cdk.AppProps {
  envPrefix?: string;
}

export class App extends cdk.App {
  constructor(props: AppProps = {}) {
    super({
      ...props,
      context: {
        ...props.context,
        ...extractEnvironmentVariables(props.envPrefix),
      },
    });
  }
}

export function extractEnvironmentVariables(prefix?: string): Record<string, string> {
  if (prefix === undefined) prefix = defaultEnvPrefix;
  const idx = prefix.length;
  const entries = Object.entries(process.env)
    .filter((env) => env[0].startsWith(prefix as string))
    .map((env) => [env[0].substr(idx), env[1]]);
  return Object.fromEntries(entries);
}
