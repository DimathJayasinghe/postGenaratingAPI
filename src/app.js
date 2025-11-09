const express = require('express');
const cors = require('cors');
const path = require('path');
const { config } = require('./config');
const routes = require('./routes/posts');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Body parsing
app.use(express.json({ limit: '5mb' }));

// CORS
app.use(cors({ origin: config.allowOrigin }));

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Static serving for generated images (optional)
app.use('/generated', express.static(config.generatedDir));

// API routes
app.use('/api', routes);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;