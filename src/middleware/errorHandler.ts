import { Request, Response, NextFunction } from 'express';
import { logger, logError } from '@/utils/logger';
import { ErrorResponse } from '@/types';

// Global error handler middleware
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error
  logError(error, {
    url: req.url,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Default error response
  let statusCode = 500;
  let errorCode = 'INTERNAL_ERROR';
  let errorMessage = 'Internal server error';
  let details: Record<string, any> = {};

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    errorMessage = 'Request validation failed';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    errorCode = 'INVALID_INPUT';
    errorMessage = 'Invalid input format';
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    errorCode = 'UNAUTHORIZED';
    errorMessage = 'Unauthorized access';
  } else if (error.name === 'ForbiddenError') {
    statusCode = 403;
    errorCode = 'FORBIDDEN';
    errorMessage = 'Access forbidden';
  } else if (error.name === 'NotFoundError') {
    statusCode = 404;
    errorCode = 'NOT_FOUND';
    errorMessage = 'Resource not found';
  } else if (error.message.includes('timeout')) {
    statusCode = 408;
    errorCode = 'TIMEOUT';
    errorMessage = 'Request timeout';
  } else if (error.message.includes('rate limit')) {
    statusCode = 429;
    errorCode = 'RATE_LIMIT_EXCEEDED';
    errorMessage = 'Rate limit exceeded';
  }

  // Don't expose internal error details in production
  if (process.env.NODE_ENV === 'production') {
    details = {};
  } else {
    details = {
      stack: error.stack,
      name: error.name,
    };
  }

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: errorCode,
      message: errorMessage,
      details,
      timestamp: new Date().toISOString(),
    },
  };

  // Send error response
  res.status(statusCode).json(errorResponse);
}

// 404 handler for undefined routes
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.warn('Route not found', {
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.url} not found`,
      details: {
        availableRoutes: [
          'POST /api/process-thread',
          'GET /api/health',
          'GET /api/modes',
          'GET /api/integrations',
        ],
      },
      timestamp: new Date().toISOString(),
    },
  };

  res.status(404).json(errorResponse);
}

// Async error wrapper for route handlers
export function asyncHandler<T extends Request, U extends Response>(
  fn: (req: T, res: U, next: NextFunction) => Promise<void>
) {
  return (req: T, res: U, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Request timeout middleware
export function timeoutHandler(timeoutMs: number = 30000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        logger.warn('Request timeout', {
          url: req.url,
          method: req.method,
          timeout: timeoutMs,
        });

        const errorResponse: ErrorResponse = {
          success: false,
          error: {
            code: 'REQUEST_TIMEOUT',
            message: 'Request timeout',
            details: {
              timeoutMs,
            },
            timestamp: new Date().toISOString(),
          },
        };

        res.status(408).json(errorResponse);
      }
    }, timeoutMs);

    // Clear timeout when response is sent
    res.on('finish', () => {
      clearTimeout(timeout);
    });

    next();
  };
}

// Security headers middleware
export function securityHeaders(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  next();
}

// Request logging middleware
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();
  
  // Log request
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      contentLength: res.get('Content-Length'),
    });
  });

  next();
}