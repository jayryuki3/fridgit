import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

let pool = null;

export function getPool() {
  if (!pool) {
    pool = new pg.Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'fridgit',
    });
    pool.on('error', (err) => {
      console.error('Unexpected pool error', err);
    });
  }
  return pool;
}

export async function testConnection(config) {
  const testPool = new pg.Pool({
    host: config.host,
    port: parseInt(config.port),
    user: config.user,
    password: config.password,
    database: config.database || 'postgres',
    connectionTimeoutMillis: 5000,
  });
  try {
    const client = await testPool.connect();
    client.release();
    await testPool.end();
    return { success: true };
  } catch (err) {
    await testPool.end().catch(() => {});
    return { success: false, error: err.message };
  }
}

export async function resetPool() {
  if (pool) {
    await pool.end().catch(() => {});
    pool = null;
  }
}

export default { query: (text, params) => getPool().query(text, params), getPool, testConnection, resetPool };
