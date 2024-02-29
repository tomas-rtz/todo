import * as appRootPath from 'app-root-path';
import * as winston from 'winston';

interface Options {
    file: {
        level: string;
        filename: string;
        handleExceptions: boolean;
        maxsize: number;
        maxFiles: number;
        format: winston.Logform.Format;
    };
    console: {
        level: string;
        handleExceptions: boolean;
        format: winston.Logform.Format;
    };
}

const options: Options = {
	file: {
		level: 'info',
		filename: `${appRootPath.path}/src/logs/app.log`,
		handleExceptions: true,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		format: winston.format.combine(
			winston.format.timestamp(),
			winston.format.json()
		),
	},
	console: {
		level: 'debug',
		handleExceptions: true,
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.simple()
		),
	},
};

const logger = winston.createLogger({
	transports: [
		new winston.transports.File(options.file),
		new winston.transports.Console(options.console),
	],
	exitOnError: false, // do not exit on handled exceptions
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(logger as any).stream = {
	write: function (message: string) {
		logger.info(message);
	},
};

export { logger };
