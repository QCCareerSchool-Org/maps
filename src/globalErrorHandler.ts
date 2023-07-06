import type { ErrorRequestHandler } from 'express';
import { logError } from './logger';

const INTERNAL_SERVER_ERROR_CODE = 500;

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logError(err);
  if (!res.headersSent) {
    res.status(INTERNAL_SERVER_ERROR_CODE).send(err.message);
  } else {
    next(err);
  }
};
