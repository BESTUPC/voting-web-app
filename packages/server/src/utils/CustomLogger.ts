import pinoHTTP from 'pino-http';
import pino from 'pino';

const pinoLog = pino(process.stdout);
const pinoErr = pino(process.stderr);

const logExpress = pinoLog.child({ module: 'express' });
const loggerInfo = pinoLog.child({ module: 'general' });
const loggerError = pinoErr.child({ module: 'general' });

export const logger = {
    info: loggerInfo.info.bind(loggerInfo),
    warn: loggerInfo.warn.bind(loggerInfo),
    trace: loggerInfo.trace.bind(loggerInfo),
    error: loggerError.error.bind(loggerInfo),
    fatal: loggerError.fatal.bind(loggerInfo),
};

export const expressLogger = pinoHTTP({ logger: logExpress });
