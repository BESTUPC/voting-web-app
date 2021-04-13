import morgan, { StreamOptions } from 'morgan';
import chalk from 'chalk';
import { Logger } from './Logger';

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream: StreamOptions = {
    // Use the http severity
    write: (message) => {
        const hasAddress = message.split(' ')[2].includes('/api/');
        if (hasAddress) Logger.http(message);
    },
};

// Skip all the Morgan http log if the
// application is not running in development mode.
// This method is not really needed here since
// we already told to the logger that it should print
// only warning and error messages in production.
const skip = () => {
    const env = process.env.NODE_ENV || 'development';
    return env !== 'development';
};

const statusColorMapper = (status: string): string => {
    const firstChar = status[0];
    switch (firstChar) {
        case '1':
            return '#ffffff';
        case '2':
            return '#2ed573';
        case '3':
            return '#1e90ff';
        case '4':
            return '#ffb142';
        case '5':
            return '#ff5252';
        default:
            return '#ff5252';
    }
};

// Build the morgan middleware
export const morganMiddleware = morgan(
    function (tokens, req, res) {
        const color = statusColorMapper(tokens.status(req, res));
        return [
            chalk.hex('#34ace0').bold(tokens.method(req, res)),
            chalk.hex(color).bold(tokens.status(req, res)),
            chalk.hex('#34ace0').bold(tokens.url(req, res)),
            chalk
                .hex('#34ace0')
                .bold(tokens['response-time'](req, res) + ' ms'),
            chalk.hex('#34ace0').bold('@ ' + tokens.date(req, res)),
            chalk.hex('#34ace0').bold(tokens['remote-addr'](req, res)),
            chalk.hex('#34ace0').bold('from ' + tokens.referrer(req, res)),
            chalk.hex('#34ace0')(tokens['user-agent'](req, res)),
        ].join(' ');
    },
    // Options: in this case, I overwrote the stream and the skip logic.
    // See the methods above.
    { stream, skip },
);
