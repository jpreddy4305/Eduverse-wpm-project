const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_CONNECTION_STRING;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI or MONGODB_CONNECTION_STRING environment variable inside .env');
}

const opts = {
  bufferCommands: false,
};

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, opts);
    console.log('MongoDB connected');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

module.exports = connectDB;

