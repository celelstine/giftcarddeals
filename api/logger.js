import winston from 'winston';

const level = process.env.LOG_LEVEL || 'warning';

export default new winston.Logger({
  transports: [
    new winston.transports.Console({
      level,
      timestamp: () => new Date().toISOString(),
    }),
    new (winston.transports.File)({ filename: 'server.log' }),
  ],
});
