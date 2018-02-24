require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: true,
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    logging: false,
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    logging: false,
    dialect: 'postgres',
  },
};
