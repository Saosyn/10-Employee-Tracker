import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432,
});

const connectToDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to the PostgreSQL database.');
    client.release();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        'Error connecting to the PostgreSQL database:',
        error.stack
      );
    } else {
      console.error('Error connecting to the PostgreSQL database:', error);
    }
    process.exit(1);
  }
};

export { pool, connectToDB };
