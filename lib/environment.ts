/**
 * Handle typical environment concerns in one simple class.
 */
export class Environment {
  constructor(public readonly env: Record<string, string>) {}

  /**
   *
   * @param defaultValues Environment variable names that re to be used in case they are not defined
   * @param required List of required environment variables (could be undefined but default)
   * @returns Merge of default and existing environment variables
   * @throws Error in case any environment variable names are not defined
   */
  public all = (defaultValues?: Record<string, string>, required?: string[]): Record<string, string> => {
    const env = new Environment({
      ...(defaultValues ?? {}),
      ...this.env,
    });
    if ((required ?? []).length > 0) env.require(...required!);
    return env.env;
  };

  /**
   * @param required All environment variable names that are not present
   * @returns
   */
  public missing = (...required: string[]) => required.filter((name) => !(name in this.env));

  /**
   * @param names All environment variable names that must be present
   * @throws Error in case any environment variable names are not defined
   */
  public require = (...names: string[]) => {
    const missing = this.missing(...names);
    if (missing.length > 0) throw new Error(`Missing environment variables ${missing.sort().join(', ')}`);
  };

  /**
   *
   * @param name Name of environment variable
   * @param defaultValue Optional default value that is used if environment variable is not defined
   * @returns value of defined environment variable, or defined default or undefined
   */
  public may = (name: string, defaultValue?: string | undefined): string | undefined =>
    name in this.env ? this.env[name] : defaultValue;

  /**
   *
   * @param name environment variable name that must be present
   * @returns Error in case environment variable is not defined
   */
  public must = (name: string) => {
    if (!(name in this.env)) throw new Error(`Missing environment variable ${name}`);
    return this.env[name];
  };
}
