'use strict';
const mongoose = require('mongoose');

class Database {
  constructor() {
    this.client = null;
    this._connect();
  }

  async _connect() {
    try {
      this.client = await mongoose.connect(process.env.DB_URL);
      console.log('Database connection successful');
    } catch (err) {
      console.error('Database connection error:' + err);
      throw err; // Rethrow error to indicate connection failure
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('Database disconnected');
    } catch (err) {
      console.error('Error disconnecting from database:', err);
    }
  }
}

module.exports = new Database();
