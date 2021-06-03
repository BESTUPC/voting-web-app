import chalk from 'chalk';
import prettyjson from 'prettyjson';

const padWithZero = (n: number, targetLength = 2): string =>
    n.toString().padStart(targetLength, '000');
const formatDate = (epoch: number): string => {
    const date = new Date(epoch);
    const days = padWithZero(date.getUTCDay());
    const months = padWithZero(date.getUTCMonth());
    const hours = padWithZero(date.getUTCHours());
    const minutes = padWithZero(date.getUTCMinutes());
    const seconds = padWithZero(date.getUTCSeconds());
    const milliseconds = padWithZero(date.getUTCMilliseconds(), 3);
    return `[${days}/${months} ${hours}:${minutes}:${seconds}.${milliseconds}]`;
};

const formatLevel = (level: number): string => {
    switch (level) {
        case 10:
            return chalk.gray('TRACE');

        case 20:
            return chalk.blueBright('DEBUG');

        case 30:
            return chalk.greenBright('INFO ');

        case 40:
            return chalk.yellowBright('WARN ');

        case 50:
            return chalk.redBright('ERROR');

        case 60:
            return chalk.bgRed.black('FATAL');
        default:
            return level.toString();
    }
};

const formatResponse = (res: { statusCode: number }): string => {
    switch (Math.floor(res.statusCode / 100) * 100) {
        case 100:
            return chalk.green(res.statusCode.toString());
        case 200:
            return chalk.green(res.statusCode.toString());
        case 300:
            return chalk.yellow(res.statusCode.toString());
        case 400:
            return chalk.redBright(res.statusCode.toString());
        case 500:
            return chalk.red(res.statusCode.toString());
    }
};

const formatMethod = (method: string): string => {
    let colorFunction: (a: string) => string = chalk.white;
    switch (method) {
        case 'GET':
        case 'POST':
            colorFunction = chalk.green;
            break;
        case 'PUT':
            colorFunction = chalk.yellow;
            break;
        case 'DELETE':
            colorFunction = chalk.redBright;
            break;
        case 'PATCH':
            colorFunction = chalk.yellowBright;
            break;
    }

    return colorFunction(method.padEnd(6, ' '));
};

const formatTime = (ms: number): string => {
    const milliseconds = ms % 1000;
    const seconds = Math.round(ms / 1000);
    const minutes = Math.round(seconds / 60);
    let output = '';
    if (minutes > 0) {
        output = minutes + 'm ' + padWithZero(seconds) + 's';
    } else if (seconds > 0) {
        output = seconds + 's ' + padWithZero(milliseconds, 3) + 'ms';
    } else {
        output = milliseconds + 'ms';
    }
    return output;
};

const formatMessage = (msg: string): string => {
    return chalk.cyan(msg);
};

const formatModule = (msg: string): string => {
    return chalk.magenta(msg);
};

const printLog = (log: Record<string, unknown>, messages: string[]): void => {
    delete log.time;
    delete log.level;
    delete log.pid;
    delete log.module;
    if (log.msg) {
        messages.push(formatMessage(log.msg as string));
        delete log.msg;
    }
    if (Object.keys(log).length > 0) {
        messages.push('\n' + prettyjson.render(log));
    }

    if (messages.length > 0) {
        console.log(messages.map((f) => (f += '\n')).join(''));
    } else {
        console.log('\n');
    }
};

const printChunk = (chunk: string): void => {
    try {
        const log = JSON.parse(chunk);
        console.log(formatDate(log.time) + ' ' + formatLevel(log.level) + ' ');

        delete log.v;
        delete log.hostname;
        const messages: string[] = [];

        switch (log.module) {
            case 'express':
                console.log(
                    [
                        formatMethod(log.req.method),
                        formatResponse(log.res),
                        chalk.white(log.req.url),
                        formatTime(log.responseTime),
                        '\n',
                    ].join(' '),
                );
                break;

            case 'general':
                printLog(log, messages);
                break;

            default:
                console.log(formatModule(log.module + ' '));
                printLog(log, messages);
                break;
        }
    } catch (err) {}
};

const processLine = (chunk: string): void => {
    const chunks = chunk.split('\n');
    chunks.filter((string) => !!string).map(printChunk);
};

process.stdin.setEncoding('utf-8');
process.stdin.on('data', processLine);
