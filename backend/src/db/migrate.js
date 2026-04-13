import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from '../db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function runMigrationsIfNeeded() {
  try {
    // Check if the account table already exists
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'account'
      )
    `);

    const tablesExist = result.rows[0].exists;

    if (tablesExist) {
      console.log('✅ Database already initialised — skipping migration.');
      return;
    }

    console.log('⚙️  Database is empty — running init.sql...');
    const sqlPath = join(__dirname, '../../database/init.sql');
    const sql = await readFile(sqlPath, 'utf8');
    await pool.query(sql);
    console.log('✅ Database initialised successfully.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    throw err;
  }
}
