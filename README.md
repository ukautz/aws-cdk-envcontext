# AWS CDK: Environment Context Experimental Feature

**This is an experiment** to increase ease-of-use of `cdk` within CI/CD. We'll see. Using the here provide `App` will make any environment variables with the prefix `CDK_CONTEXT_` available in the [context](https://docs.aws.amazon.com/cdk/latest/guide/context.html). The name in the context does not contain the prefix, e.g. from `CDK_CONTEXT_someVar` will be available with `const someVar = this.node.tryGetContext("someVar")`. The prefix can be modified in the `AppProps`.

**Limitation:** CDK internal context keys like "@aws-cdk/core:bootstrapQualifier" cannot be provided due to character limitations of environment variable names, which are: `[a-zA-Z_][a-zA-Z0-9_]*`. Could be solved with intermediate encoding, but seems like too much complexity in usage, for cases that could (and should?) be used via `cdk.json` or `cdk.context.json` and likely also better `--context` because this is a highly framework specific.

## Usage

**Note:** The created NPM package is hosted on [Github packages}(https://github.com/features/packages) as I do not consider it production ready and do not want to contribute to accidental installs… Read up how to [use Github Packages hosted NPM packages](https://docs.github.com/en/packages/guides/configuring-npm-for-use-with-github-packages#installing-a-package) if you want to use it.

in your `bin/file.ts`:

```typescript
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { App } from '@ukautz/aws-cdk-envcontext';
import { YourStack } from '../lib/your-stack';

// use app from envcontext
const app = new App();
new YourStack(app, 'YourStack');
```

Then in `lib/your-stack.ts`:

```typescript
import * as cdk from '@aws-cdk/core';

export class ExamplesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new cdk.CfnOutput(this, 'Output', {
      value: this.node.tryGetContext('foo'),
    });
  }
}
```

Then in the command line:

```shell
$ export CDK_CONTEXT_foo=bar
$ cdk synth
```

The rendered CloudFormation YAML should contain:

```yaml
Outputs:
  Output:
    Value: bar
```


## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests