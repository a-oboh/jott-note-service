import pino from 'pino';
import expressPino from 'express-pino-logger';

const logger = pino({ level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', });
const expressLogger = expressPino({ logger });

export{logger, expressLogger}