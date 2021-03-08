# AWS CDK: Environment Context Feature

This is an experiment. I am investigating how to use AWS CDK within CI/CD pipelines. Attempt is to loosen the coupling using environment variables as an interface for `cdk` execution, instead of injecting service infra configuration via `--context` parameters.

## Usage

**Note** The created NPM package is hosted on [Github packages}(https://github.com/features/packages) as I do not consider it production ready and do not want to contribute to accidental installs… Read up how to [use Github Packages hosted NPM packages](https://docs.github.com/en/packages/guides/configuring-npm-for-use-with-github-packages#installing-a-package) if you want to use it.

```typescript
// TODO
```



## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests