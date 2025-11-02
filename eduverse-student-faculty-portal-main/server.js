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
  dev,
  dir: __dirname,
});
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// ✅ Graceful shutdown (optional but recommended)
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting reconnection...');
  connectDB();
});

app.prepare()
  .then(async () => {
    const server = express();

    // Connect to database before starting server
    await connectDB();

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

    // Start server
    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🌱 Environment: ${dev ? 'development' : 'production'}`);
    });
  })
  .catch((ex) => {
    console.error('❌ Server startup error:', ex);
    process.exit(1);
  });
