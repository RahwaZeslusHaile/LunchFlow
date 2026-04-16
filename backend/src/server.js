import 'dotenv/config';
import app from './app.js';
import { runMigrationsIfNeeded } from './db/migrate.js';

const PORT = process.env.PORT || 4000;

const startTimestamp = Date.now();

runMigrationsIfNeeded()
  .then(() => {
    const migrationDuration = Date.now() - startTimestamp;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 LunchFlow backend running on port ${PORT}`);
      console.log(`⏱️ Startup sequence (including migrations) took: ${migrationDuration}ms`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  });
