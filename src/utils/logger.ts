import winston, { format } from 'winston';

// Custom log format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.json(),
  format.prettyPrint()
);

// Console format for development
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'HH:mm:ss' }),
  format.printf((info: import('logform').TransformableInfo) => {
    const { timestamp, level, message, ...meta } = info;
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp ?? ''} [${level}]: ${message} ${metaStr}`;
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'smartthread-backend' },
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat,
    }),
    ...(process.env.NODE_ENV === 'production'
      ? [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5,
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880,
            maxFiles: 5,
          }),
        ]
      : []),
  ],
});

// Create logs directory if it doesn't exist
if (process.env.NODE_ENV === 'production') {
  const fs = require('fs');
  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
  }
}

// Logging helpers
export const logRequest = (method: string, url: string, userId?: string) => {
  logger.info('HTTP Request', {
    method,
    url,
    userId,
    type: 'request',
  });
};

export const logResponse = (method: string, url: string, statusCode: number, duration: number) => {
  logger.info('HTTP Response', {
    method,
    url,
    statusCode,
    duration,
    type: 'response',
  });
};

export const logError = (error: Error, context?: Record<string, any>) => {
  logger.error('Application Error', {
    message: error.message,
    stack: error.stack,
    ...context,
    type: 'error',
  });
};

export const logOpenAIRequest = (model: string, tokens: number, mode: string) => {
  logger.info('OpenAI Request', {
    model,
    tokens,
    mode,
    type: 'openai_request',
  });
};

export const logOpenAIResponse = (model: string, tokensUsed: number, duration: number, success: boolean) => {
  logger.info('OpenAI Response', {
    model,
    tokensUsed,
    duration,
    success,
    type: 'openai_response',
  });
};
