// Migration: Add consumption tracking columns to meals table
// Run with: node server/db/migrations/001_add_consumption_tracking.js

import { getPool } from '../index.js';

const MIGRATION_SQL = `
ALTER TABLE meals ADD COLUMN IF NOT EXISTS item_id INTEGER REFERENCES items(id) ON DELETE SET NULL;
ALTER TABLE meals ADD COLUMN IF NOT EXISTS servings NUMERIC(5,2) DEFAULT 1;
ALTER TABLE meals ADD COLUMN IF NOT EXISTS consumed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
`;

export async function runMigration() {
  const pool = getPool();
  try {
    await pool.query(MIGRATION_SQL);
    console.log('Migration 001_add_consumption_tracking completed successfully');
    return true;
  } catch (error) {
    console.error('Migration failed:', error.message);
    return false;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration().then(() => process.exit(0)).catch(() => process.exit(1));
}
