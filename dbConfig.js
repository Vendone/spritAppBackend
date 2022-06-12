require('dotenv').config();

const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const connectionString = { connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}` };
const productionSsl = { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } };
const pool = new Pool(
    isProduction ? productionSsl : connectionString
);

module.exports = { pool };