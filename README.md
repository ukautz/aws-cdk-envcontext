# AWS CDK: Environment Context Experimental Feature

**This is an experiment** to increase ease-of-use of `cdk` within CI/CD. We'll see. Using the here provide `App` will make any environment variables with the prefix `CDK_CONTEXT_` available in the [context](https://docs.aws.amazon.com/cdk/latest/guide/context.html). The name in the context does not contain the prefix, e.g. from `CDK_CONTEXT_someVar` will be available with `const someVar = this.node.tryGetContext("someVar")`. The prefix can be modified in the `AppProps`.

**Limitation:** CDK internal context keys like "@aws-cdk/core:bootstrapQualifier" cannot be provided due to character limitations of environment variable names, which are: `[a-zA-Z_][a-zA-Z0-9_]*`. Could be solved with intermediate encoding, but seems like too much complexity in usage, for cases that could (and should?) be used via `cdk.json` or `cdk.context.json` and likely also better `--context`.

**Use Case**: CustomResources for CloudFormation that is implemented as Lambda and/or ECS task that executes `cdk deploy`, `cdk destroy` etc. Context parameters are provided by environment or secrets anyway.

## Usage

**Note:** The created NPM package is hosted on [Github packages](https://github.com/features/packages) as I do not consider it production ready and do not want to contribute to accidental installs… Read up how to [use Github Packages hosted NPM packages](https://docs.github.com/en/packages/guides/configuring-npm-for-use-with-github-packages#installing-a-package) if you want to use it.

in your `bin/file.ts`:

```typescript
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as envcontext from '@ukautz/aws-cdk-envcontext';
import { YourStack } from '../lib/your-stack';

// use app from envcontext
const app = new envcontext.App();
new YourStack(app, 'YourStack');
```

Assuming the following environment variablse:

```
CDK_CONTEXT_myVar=foo
CDK_CONTEXT_otherVar=bar
```

Then in `lib/your-stack.ts`:

```typescript
import * as cdk from '@aws-cdk/core';

export class ExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // access context injected from env
    const myVar = this.node.tryGetContext('myVar');

    new cdk.CfnOutput(this, 'Vars', {
      value: `myVar = ${myVar}`, // will contain 'myVar = foo, someVar = bar'
    });
  }
}
```

Then in the command line:

```shell
$ export CDK_CONTEXT_myVar=foo
$ cdk synth
```

The rendered CloudFormation YAML should contain:

```yaml
Outputs:
  Vars:
    Value: 'myVar = foo'
```

### Using the context object

When working with a lot of parameterized values in context, here a little syntax sugar and simplified API to work with context.

```typescript
import * as cdk from '@aws-cdk/core';
import { contextOf } from '@ukautz/aws-cdk-envcontext';

export class ExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const context = contextOf(this);
    
    // get optional value, with fallback to default if missing
    const mayVar = context.may('myVar', 'saneDefault'); 

    // get mandatory value or throw exception if missing
    const mustVar = context.must('otherVar');

    // ...
  }
}
```

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
