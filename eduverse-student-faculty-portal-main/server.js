// Load environment variables
require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // Also try .env file

const express = require('express');
const next = require('next');
const cors = require('cors');
const assignmentsRouter = require('./server/routes/assignments');
const noticesRouter = require('./server/routes/notices');
const resourcesRouter = require('./server/routes/resources');
const submissionsRouter = require('./server/routes/submissions');
const timetableRouter = require('./server/routes/timetable');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ 
  dev,
  dir: __dirname
});
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  // Middleware
  server.use(cors());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // API Routes - Must come before Next.js handler
  server.use('/api/assignments', assignmentsRouter);
  server.use('/api/notices', noticesRouter);
  server.use('/api/resources', resourcesRouter);
  server.use('/api/submissions', submissionsRouter);
  server.use('/api/timetable', timetableRouter);

  // Handle all other routes with Next.js (including static assets)
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
    console.log(`> Environment: ${dev ? 'development' : 'production'}`);
    console.log(`> Using Express backend for /api routes`);
  });
}).catch((ex) => {
  console.error('Server startup error:', ex);
  process.exit(1);
});

