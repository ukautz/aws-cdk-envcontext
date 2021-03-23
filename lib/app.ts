import * as cdk from '@aws-cdk/core';
import { Environment } from './environment';
import { extractEnvironmentVariables } from './util';

export interface AppProps extends cdk.AppProps {
  /**
   * Prefix for environment variables that are to be translated into context variables
   *
   * @default CDK_CONTEXT_
   */
  readonly contextEnvPrefix?: string;
}

/**
 * An App that extracts context from environment variables.
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
  public readonly env: Environment;
  constructor(props: AppProps = {}) {
    super({
      ...props,
      context: {
        ...extractEnvironmentVariables(props.contextEnvPrefix),
        ...props.context,
      },
    });
    this.env = new Environment(extractEnvironmentVariables(props.contextEnvPrefix));
  }

  public static envOf(scope: cdk.Construct): Environment {
    const app = cdk.App.of(scope) as App;
    return app.env;
  }
}
