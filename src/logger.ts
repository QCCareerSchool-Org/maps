import { NodemailerTransport } from '@qccareerschool/winston-nodemailer';
import winston from 'winston';

import config from './config';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new NodemailerTransport({
      host: config.logEmail.host,
      port: config.logEmail.port,
      secure: config.logEmail.mode === 'TLS',
      auth: {
        user: config.logEmail.username,
        pass: config.logEmail.password,
      },
      from: config.logEmail.from,
      to: config.logEmail.to,
      tags: [ 'maps' ],
      level: 'error',
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export const logError = (message: string, ...meta: unknown[]): void => {
  logger.error(message, meta);
};

export const logWarning = (message: string, ...meta: unknown[]): void => {
  logger.warn(message, meta);
};

export const logInfo = (message: string, ...meta: unknown[]): void => {
  logger.info(message, meta);
};
