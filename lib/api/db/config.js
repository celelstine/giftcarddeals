'use strict';

var Sequelize = require('sequelize');

require('dotenv').config();

var Op = Sequelize.Op;

module.exports = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: Op,
    logging: false
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    logging: false,
    dialect: 'postgres',
    operatorsAliases: Op
  },
  dev2: {
    username: process.env.MYSQL_DATABASE_USERNAME,
    password: process.env.MYSQL_DATABASE_PASSWORD,
    database: process.env.MYSQL_DATABASE_NAME,
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: Op
  },
  production: {
    username: process.env.MYSQL_DATABASE_USERNAME,
    password: process.env.MYSQL_DATABASE_PASSWORD,
    database: process.env.MYSQL_DATABASE_NAME,
    host: process.env.MYSQL_DATABASE_HOST,
    dialect: 'mysql',
    port: 3306,
    operatorsAliases: Op
  }
};