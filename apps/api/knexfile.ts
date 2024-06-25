import * as dotenv from 'dotenv';
dotenv.config();
import { existsSync, mkdirSync } from 'fs-extra';
import type { Knex } from 'knex';
import * as pg from 'pg';

console.log(pg)
const { DB_TYPE, DB_NAME, DB_HOST, DB_PORT, DB_USER, DB_PASS } = process.env;
if (!existsSync(__dirname + '/database/migrations')) {
  mkdirSync(__dirname + '/database/migrations', { recursive: true });
}
if (!existsSync(__dirname + '/database/seeds')) {
  mkdirSync(__dirname + '/database/seeds', { recursive: true });
}

const config: { [key: string]: Knex.Config } = {
  development: {
    client: DB_TYPE,
    connection: {
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
    },
    migrations: {
      directory: './database/migrations',
      tableName: 'migrations',
      loadExtensions: ['.ts'],
      extension: 'ts',
    },
    seeds: {
      directory: './database/seeds',
      loadExtensions: ['.ts'],
      extension: 'ts',
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: DB_TYPE,
    connection: {
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './database/migrations',
    },
    seeds: { directory: './database/seeds' },
  },
};

module.exports = config;
