import express from 'express';
import pg from 'pg';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';
import { resetPool } from '../db/index.js';
import { initializeSchema } from '../db/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

// GET /api/setup/status - Check if app is configured
router.get('/status', (req, res) => {
  const envPath = join(__dirname, '..', '.env');
  const configured = fs.existsSync(envPath);
  res.json({ configured });
});

// POST /api/setup/test - Test database connection
router.post('/test', async (req, res) => {
  const { host, port, user, password } = req.body;
  const testPool = new pg.Pool({
    host, port: parseInt(port), user, password,
    database: 'postgres',
    connectionTimeoutMillis: 5000,
  });
  try {
    const client = await testPool.connect();
    client.release();
    await testPool.end();
    res.json({ success: true, message: 'Connection successful' });
  } catch (err) {
    await testPool.end().catch(() => {});
    res.json({ success: false, message: err.message });
  }
});

// POST /api/setup/configure - Save config, create DB, init schema
router.post('/configure', async (req, res) => {
  const { host, port, user, password, database, spoonacularKey } = req.body;
  const dbName = database || 'fridgit';

  // Try to create the database (ignore error if exists)
  const adminPool = new pg.Pool({
    host, port: parseInt(port), user, password,
    database: 'postgres',
    connectionTimeoutMillis: 5000,
  });
  try {
    await adminPool.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Database "${dbName}" created`);
  } catch (err) {
    if (err.code !== '42P04') { // 42P04 = database already exists
      console.log(`Database note: ${err.message}`);
    }
  }
  await adminPool.end().catch(() => {});

  // Write .env file
  const jwtSecret = crypto.randomBytes(32).toString('base64');
  const envContent = [
    `PORT=3000`,
    `DB_HOST=${host}`,
    `DB_PORT=${port}`,
    `DB_USER=${user}`,
    `DB_PASS=${password}`,
    `DB_NAME=${dbName}`,
    `JWT_SECRET=${jwtSecret}`,
    `SPOONACULAR_API_KEY=${spoonacularKey || ''}`,
    `NODE_ENV=development`,
  ].join('\n') + '\n';

  const envPath = join(__dirname, '..', '.env');
  fs.writeFileSync(envPath, envContent);

  // Reset pool so it picks up new config
  await resetPool();

  // Re-read env
  const dotenv = await import('dotenv');
  dotenv.config({ path: envPath, override: true });

  // Initialize schema
  const schemaOk = await initializeSchema();

  if (schemaOk) {
    res.json({ success: true, message: 'Configuration saved and database initialized' });
  } else {
    res.json({ success: false, message: 'Config saved but schema initialization failed. Check database permissions.' });
  }
});

export default router;
