import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from '../db.js';
import bcrypt from 'bcrypt';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function runMigrationsIfNeeded() {
  try {
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
    let sql = await readFile(sqlPath, 'utf8');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@codeyourfuture.io';
    const adminPassRaw = process.env.ADMIN_PASSWORD || 'Admin1234!';
    const adminName = process.env.ADMIN_NAME || 'CYF Admin';
    const adminPassHash = await bcrypt.hash(adminPassRaw, 10);

    sql = sql.replace('{{ADMIN_EMAIL}}', adminEmail)
             .replace('{{ADMIN_PASS}}', adminPassHash)
             .replace('{{ADMIN_NAME}}', adminName);

    await pool.query(sql);
    console.log(`✅ Database initialised successfully with admin user: ${adminEmail}`);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    throw err;
  }
}
