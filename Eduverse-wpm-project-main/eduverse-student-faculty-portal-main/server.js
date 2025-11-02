// Load environment variables
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const express = require('express');
const next = require('next');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const assignmentsRouter = require('./server/routes/assignments');
const noticesRouter = require('./server/routes/notices');
const resourcesRouter = require('./server/routes/resources');
const submissionsRouter = require('./server/routes/submissions');
const timetableRouter = require('./server/routes/timetable');

const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev: false, // Always use production mode (uses .next build)
  dir: __dirname,
});
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB Atlas (non-blocking)
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_CONNECTION_STRING || process.env.MONGO_URI;
    if (!mongoUri) {
      console.warn('⚠️ MongoDB URI not found. Some features may not work. Set MONGODB_URI environment variable.');
      return false;
    }
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected Successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.warn('⚠️ Continuing without MongoDB connection. Some features may not work.');
    return false;
  }
};

// ✅ Graceful shutdown and reconnection
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting reconnection...');
  setTimeout(() => connectDB(), 5000); // Retry after 5 seconds
});

// Health check endpoint
const healthCheck = (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoStatus,
    port: PORT
  });
};

app.prepare()
  .then(async () => {
    const server = express();

    // Health check endpoint (before other routes)
    server.get('/health', healthCheck);

    // Middleware
    server.use(cors());
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    // API Routes
    server.use('/api/assignments', assignmentsRouter);
    server.use('/api/notices', noticesRouter);
    server.use('/api/resources', resourcesRouter);
    server.use('/api/submissions', submissionsRouter);
    server.use('/api/timetable', timetableRouter);

    // Handle all other routes with Next.js
    server.all('*', (req, res) => handle(req, res));

    // Connect to database (non-blocking)
    connectDB().then(connected => {
      if (connected) {
        console.log('✅ Database connection established');
      }
    });

    // Start server (don't wait for MongoDB)
    server.listen(PORT, '0.0.0.0', (err) => {
      if (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
      }
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌱 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📍 Health check: http://0.0.0.0:${PORT}/health`);
    });
  })
  .catch((ex) => {
    console.error('❌ Server startup error:', ex);
    process.exit(1);
  });
