// sync.js - Sync Sequelize models and test DB connection
import { sequelize } from './models/index.js';

async function syncDB() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models
    await sequelize.sync({ alter: true }); // Use { force: true } ONLY if you want to drop and recreate tables
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

syncDB();
