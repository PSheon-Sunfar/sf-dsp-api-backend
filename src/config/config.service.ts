import * as config from 'config';

/**
 * Key-value mapping
 */
export interface EnvConfig {
  [key: string]: string;
}

/**
 * Config Service
 */
export class ConfigService {
  /**
   * Object that will contain the injected environment variables
   */
  private readonly envConfig: EnvConfig;

  /**
   * Constructor
   * @param {string} filePath
   */
  constructor() {
    this.envConfig = ConfigService.validateInput(config);
    /* ANCHOR */
    /* Fitting Azure App Service */
    if (Object.entries(this.envConfig).length === 0) {
      this.envConfig = Object.assign(this.envConfig, {
        APP_URL: process.env.APP_URL,
        MONGO_URI: process.env.MONGO_URI,
        AZURE_STORAGE_SAS_KEY: process.env.AZURE_STORAGE_SAS_KEY,
        AZURE_STORAGE_ACCOUNT: process.env.AZURE_STORAGE_ACCOUNT,
        WEBTOKEN_SECRET_KEY: process.env.WEBTOKEN_SECRET_KEY,
        JWT_SECRET: process.env.JWT_SECRET,
        ENCRYPT_JWT_SECRET: process.env.ENCRYPT_JWT_SECRET,
        WEBTOKEN_EXPIRATION_TIME: process.env.WEBTOKEN_EXPIRATION_TIME,
      });
    }
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   * @param {EnvConfig} envConfig the configuration object with variables from the configuration file
   * @returns {EnvConfig} a validated environment configuration object
   */
  private static validateInput(envConfig: EnvConfig): EnvConfig {
    /**
     * A schema to validate envConfig against
     */
    // const envVarsSchema: joi.ObjectSchema = joi.object({
    //   APP_ENV: joi
    //     .string()
    //     .valid('dev', 'prod')
    //     .default('dev'),
    //   APP_URL: joi.string().uri({
    //     scheme: [/https?/],
    //   }),
    //   WEBTOKEN_SECRET_KEY: joi.string().required(),
    //   WEBTOKEN_EXPIRATION_TIME: joi.number().default(1800),
    //   DB_URL: joi.string().regex(/^mongodb/),
    // });

    // /**
    //  * Represents the status of validation check on the configuration file
    //  */
    // const { error, value: validatedEnvConfig } = envVarsSchema.validate(
    //   envConfig,
    // );
    // if (error) {
    //   throw new Error(`Config validation error: ${error.message}`);
    // }
    // return validatedEnvConfig;

    return envConfig;
  }

  /**
   * Fetches the key from the configuration file
   * @param {string} key
   * @returns {string} the associated value for a given key
   */
  get(key: string): string {
    return this.envConfig[key];
  }

  /**
   * Checks whether the application environment set in the configuration file matches the environment parameter
   * @param {string} env
   * @returns {boolean} Whether or not the environment variable matches the application environment
   */
  isEnv(env: string): boolean {
    return process.env.NODE_ENV === env;
  }
}
