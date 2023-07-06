import dotenv from 'dotenv';

dotenv.config();

function parseNumberEnvironmentVariable(key: string): number | undefined;
function parseNumberEnvironmentVariable(key: string, defaultValue: number): number;
function parseNumberEnvironmentVariable(key: string, defaultValue?: number): number | undefined {
  const stringValue = process.env[key];
  if (stringValue) {
    const numericValue = parseInt(stringValue, 10);
    if (!isNaN(numericValue)) {
      return numericValue;
    }
  }
  return defaultValue;
}

export default {
  port: parseNumberEnvironmentVariable('PORT', 15010),
  filePath: process.env.FILEPATH ?? '/tmp/maps',
  googleApiKey: process.env.GOOGLE_API_KEY,
  cacheTimeMs: parseNumberEnvironmentVariable('CACHE_TIME', 31_536_000_000), // one year default
  logEmail: {
    host: process.env.LOG_EMAIL_HOST ?? 'mail.qccareerschool.com',
    username: process.env.LOG_EMAIL_USERNAME ?? 'test',
    password: process.env.LOG_EMAIL_PASSWORD ?? 'test',
    mode: process.env.LOG_EMAIL_MODE,
    port: parseNumberEnvironmentVariable('LOG_EMAIL_PORT', 587),
    to: 'administrator@qccareerschool.com',
    from: 'winston@qccareerschool.com',
  },
};
