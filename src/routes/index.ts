import { Router } from 'express';
import {
  processThreadController,
  healthCheckController,
  getModesController,
  getIntegrationsController,
} from '@/controllers/threadController';
import {
  validateProcessThread,
  validateRequestSize,
  validateRateLimit,
  validateThreadContent,
} from '@/middleware/validation';
import { asyncHandler } from '@/middleware/errorHandler';

// Create router instance
const router = Router();

// Apply rate limiting to all routes
router.use(validateRateLimit(100, 1)); // 100 requests per minute
router.use(validateRequestSize(500)); // 500KB max request size

// Health check endpoint (no validation needed)
router.get('/health', asyncHandler(healthCheckController));

// Get available processing modes
router.get('/modes', getModesController);

// Get integration status
router.get('/integrations', getIntegrationsController);

// Main thread processing endpoint with comprehensive validation
router.post(
  '/process-thread',
  validateProcessThread,
  validateThreadContent,
  asyncHandler(processThreadController)
);

// API documentation endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'SmartThread API',
    version: '1.0.0',
    description: 'AI-powered thread processing for generating commit messages, PR titles, Notion tasks, and meeting summaries',
    endpoints: {
      'POST /api/process-thread': {
        description: 'Process a thread of messages to generate structured output',
        parameters: {
          thread: 'Array of messages with sender and text',
          mode: 'Processing mode: github, notion, or summary',
          options: 'Optional configuration based on mode',
        },
        example: {
          thread: [
            { sender: 'Alice', text: 'Fixed the login bug' },
            { sender: 'Bob', text: 'Great! Ready for merge' },
          ],
          mode: 'github',
        },
      },
      'GET /api/health': {
        description: 'Check API and service health status',
      },
      'GET /api/modes': {
        description: 'Get available processing modes and examples',
      },
      'GET /api/integrations': {
        description: 'Get status of external integrations',
      },
    },
    supportedModes: [
      {
        name: 'github',
        description: 'Generate commit messages and PR suggestions',
        outputFormat: 'GitHubResponse',
      },
      {
        name: 'notion',
        description: 'Create actionable tasks and project items',
        outputFormat: 'NotionResponse',
      },
      {
        name: 'summary',
        description: 'Generate meeting summaries and action items',
        outputFormat: 'SummaryResponse',
      },
    ],
    rateLimit: {
      requests: 100,
      window: '1 minute',
    },
    maxRequestSize: '500KB',
  });
});

export default router;