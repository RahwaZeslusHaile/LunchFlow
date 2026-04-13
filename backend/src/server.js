import 'dotenv/config';
import app from './app.js';
import { runMigrationsIfNeeded } from './db/migrate.js';

const PORT = process.env.PORT || 4000;

runMigrationsIfNeeded()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`LunchFlow backend running on port ${PORT} (accessible on network)`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  });
