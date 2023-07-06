import compression from 'compression';
import cors, { CorsOptions } from 'cors';
import express from 'express';
import helmet from 'helmet';

import { asyncWrapper } from './asyncWrapper';
import config from './config';
import { globalErrorHandler } from './globalErrorHandler';
import { handleMapGet } from './handlers';
import { logInfo } from './logger';

const corsOptions: CorsOptions = {
  origin: [
    /\.qccareerschool\.com$/iu,
    /\.qcmakeupacademy\.com$/iu,
    /\.qcdesignschool\.com$/iu,
    /\.qceventplanning\.com$/iu,
    /\.qcpetstudies\.com$/iu,
    /\.qcwellnessstudies\.com$/iu,
  ],
};

const app = express();
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());

app.get('/', asyncWrapper(handleMapGet));
app.use(globalErrorHandler);

app.listen(config.port, () => {
  logInfo(`starting server on port ${config.port}`);
});
