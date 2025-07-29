import { Request, Response } from 'express';
import { processThread } from '@/services/openai';
import { logger, logRequest, logResponse } from '@/utils/logger';
import {
  ProcessThreadRequest,
  ProcessThreadResponse,
  ErrorResponse,
  ProcessingMode,
} from '@/types';

// Main controller for processing threads
export async function processThreadController(
  req: Request<{}, ProcessThreadResponse | ErrorResponse, ProcessThreadRequest>,
  res: Response<ProcessThreadResponse | ErrorResponse>
): Promise<void> {
  const startTime = Date.now();
  const { thread, mode, options } = req.body;
  
  logRequest('POST', '/process-thread', undefined);
  
  try {
    // Validate thread content
    if (!thread || thread.length === 0) {
      res.status(400).json({
        success: false,
        error: {
          code: 'EMPTY_THREAD',
          message: 'Thread cannot be empty',
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    // Extract unique participants
    const participants = Array.from(new Set(thread.map(msg => msg.sender)));
    
    logger.info('Processing thread request', {
      mode,
      threadLength: thread.length,
      participants: participants.length,
      options,
    });

    // Process the thread using OpenAI
    const result = await processThread(thread, mode, options);
    
    const processingTimeMs = Date.now() - startTime;
    
    // Build response
    const response: ProcessThreadResponse = {
      mode,
      success: true,
      data: result,
      metadata: {
        processedAt: new Date().toISOString(),
        threadLength: thread.length,
        processingTimeMs,
        model: 'gpt-4-1106-preview', // This should come from config
      },
    };

    logResponse('POST', '/process-thread', 200, processingTimeMs);
    
    logger.info('Thread processed successfully', {
      mode,
      threadLength: thread.length,
      processingTimeMs,
      confidence: 'confidence' in result ? result.confidence : 'N/A',
    });

    res.status(200).json(response);

  } catch (error) {
    const processingTimeMs = Date.now() - startTime;
    
    logger.error('Thread processing failed', {
      mode,
      threadLength: thread?.length || 0,
      processingTimeMs,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    logResponse('POST', '/process-thread', 500, processingTimeMs);

    // Determine error response based on error type
    let statusCode = 500;
    let errorCode = 'PROCESSING_ERROR';
    let errorMessage = 'Failed to process thread';

    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        statusCode = 429;
        errorCode = 'RATE_LIMIT_ERROR';
        errorMessage = 'OpenAI rate limit exceeded';
      } else if (error.message.includes('authentication')) {
        statusCode = 401;
        errorCode = 'AUTH_ERROR';
        errorMessage = 'OpenAI authentication failed';
      } else if (error.message.includes('quota')) {
        statusCode = 402;
        errorCode = 'QUOTA_ERROR';
        errorMessage = 'OpenAI quota exceeded';
      }
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
        details: {
          processingTimeMs,
          mode,
          threadLength: thread?.length || 0,
        },
        timestamp: new Date().toISOString(),
      },
    };

    res.status(statusCode).json(errorResponse);
  }
}

// Health check controller
export async function healthCheckController(
  req: Request,
  res: Response
): Promise<void> {
  logRequest('GET', '/health', undefined);
  
  try {
    // Check OpenAI service
    const { healthCheck } = await import('@/services/openai');
    const openaiHealthy = await healthCheck();
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        openai: openaiHealthy ? 'healthy' : 'unhealthy',
        server: 'healthy',
      },
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
    };

    const statusCode = openaiHealthy ? 200 : 503;
    
    logResponse('GET', '/health', statusCode, 0);
    
    res.status(statusCode).json(health);
    
  } catch (error) {
    logger.error('Health check failed', { error });
    
    logResponse('GET', '/health', 500, 0);
    
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
}

// Get supported modes controller
export function getModesController(
  req: Request,
  res: Response
): void {
  logRequest('GET', '/modes', undefined);
  
  const modes = {
    available: ['github', 'notion', 'summary'] as ProcessingMode[],
    descriptions: {
      github: 'Generate commit messages and PR suggestions from thread discussions',
      notion: 'Create actionable tasks and project items from conversations',
      summary: 'Generate comprehensive meeting summaries and action items',
    },
    examples: {
      github: {
        input: {
          thread: [
            { sender: 'Alice', text: 'The login bug is fixed, ready for review' },
            { sender: 'Bob', text: 'Great! I\'ll test it and merge if all looks good' },
          ],
          mode: 'github',
        },
        output: 'Commit messages and PR details',
      },
      notion: {
        input: {
          thread: [
            { sender: 'Manager', text: 'We need to update the user dashboard' },
            { sender: 'Dev', text: 'I can work on the UI improvements' },
          ],
          mode: 'notion',
        },
        output: 'Structured tasks with priorities and assignments',
      },
      summary: {
        input: {
          thread: [
            { sender: 'Lead', text: 'Let\'s discuss the project timeline' },
            { sender: 'Team', text: 'We need 2 more weeks for testing' },
          ],
          mode: 'summary',
        },
        output: 'Meeting summary with key decisions and next steps',
      },
    },
  };

  logResponse('GET', '/modes', 200, 0);
  
  res.status(200).json(modes);
}

// Get integration status controller
export function getIntegrationsController(
  req: Request,
  res: Response
): void {
  logRequest('GET', '/integrations', undefined);
  
  const { integrations } = require('@/config');
  
  const status = {
    timestamp: new Date().toISOString(),
    integrations: Object.entries(integrations).map(([name, config]: [string, any]) => ({
      name,
      enabled: config.enabled,
      configured: config.configured,
      status: config.enabled ? 'available' : 'not_configured',
    })),
  };

  logResponse('GET', '/integrations', 200, 0);
  
  res.status(200).json(status);
}