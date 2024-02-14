// initDB.js
require('dotenv').config();
const mongoose = require('mongoose');

// Import your Mongoose models
const User = require('./models/User');

async function initDB() {
  try {
    // Connect to MongoDB and create a new database if it doesn't exist
    await mongoose.connect(process.env.DB_URL);

    // Drop all existing collections (if any)
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
    }

    // Create new collections with initial data
    const usersData = [
      { username: 'user1', password: 'password1' },
      { username: 'user2', password: 'password2' },
    ];

    await User.create(usersData);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
  }
}

// Execute the function
initDB();
