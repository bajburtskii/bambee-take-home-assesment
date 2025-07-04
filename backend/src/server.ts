import app from './app';
import { initDb } from './db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize the database:', err);
    process.exit(1);
  }
})();
