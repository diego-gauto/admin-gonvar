import { registerAs } from '@nestjs/config';

export const environment = registerAs('environment', () => ({
  PORT: process.env.PORT || 3000,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 5432,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  JWT_SECRET: process.env.JWT_SECRET || 'Default',
  //   CRON_ADMINTIME: process.env.CRON_ADMINTIME || '0 20 * * 7',
  //   CRON_CHECKBOOKS: process.env.CRON_CHECKBOOKS || '0 8 * * *',
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || '').split(','),
  ALLOWED_LOCAL_IPS: (process.env.ALLOWED_LOCAL_IPS || '').split(','),
}));
