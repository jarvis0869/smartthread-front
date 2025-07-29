import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import threadsRouter from './routes/threads.js';
import teamsRouter from './routes/teams.js';
import analyticsRouter from './routes/analytics.js';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/threads', threadsRouter);
app.use('/api/thread', threadsRouter); // Support both /api/threads and /api/thread for compatibility
app.use('/api/teams', teamsRouter);
app.use('/api/analytics', analyticsRouter);

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Thread Processor API',
    version: '1.0.0',
    description: 'Backend API for thread processing application',
    endpoints: {
      threads: '/api/threads',
      teams: '/api/teams', 
      analytics: '/api/analytics',
      health: '/health'
    }
  });
});

// 404 handler for unknown routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 CORS enabled for: ${CORS_ORIGIN}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 API available at: http://localhost:${PORT}/api`);
  console.log(`❤️  Health check at: http://localhost:${PORT}/health`);
});

export default app;