import { createLogger, format, LoggerOptions, transports } from 'winston';
import { utilities } from 'nest-winston';
import 'winston-daily-rotate-file';

// Default log settings for debug mode
let logLevel = 'debug';
let logFormat = format.combine(
  format.errors({ stack: true }),
  format.timestamp(),
  utilities.format.nestLike('App')
);

// Production overrides
if (process.env['NODE_ENV'] === 'production') {
  logLevel = process.env['LOG_LEVEL'] || 'info';
  logFormat = format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.json()
  );
}

const logTransports = [
  new transports.Console(),
  new transports.DailyRotateFile({
    dirname: process.env['LOG_DIR'] || 'logs/vms',
    filename: '%DATE%.system.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: 10,
  }),
  new transports.DailyRotateFile({
    level: 'error',
    dirname: process.env['LOG_DIR'] || 'logs/vms',
    filename: '%DATE%.error.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: 10,
  })
];

export const logger = createLogger({
  level: logLevel,
  format: logFormat,
  transports: logTransports,
  handleExceptions: true,
  exitOnError: true,
  exceptionHandlers: logTransports,
  rejectionHandlers: logTransports,
} as LoggerOptions);

export const loggerGroup = (type: string) => {
  const _transports = [
    new transports.DailyRotateFile({
      dirname: process.env['LOG_DIR'] || 'logs/vms',
      filename: `%DATE%.${type}.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: 10,
    }),
  ];

  return createLogger({
    level: 'info',
    format: format.combine(
      format.errors({ stack: true }),
      format.timestamp(),
      format.json()
    ),
    transports: _transports,
    handleExceptions: true,
    exitOnError: true,
    exceptionHandlers: _transports,
    rejectionHandlers: _transports,
  });
};
