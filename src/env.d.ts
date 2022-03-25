declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    HOST: string;
    PORT: string;
    DB_HOST: string;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    APP_SECRET: string;
    REDIS_URL: string;
    CORS_ORIGIN: string;
  }
}
