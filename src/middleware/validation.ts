import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { logger } from '@/utils/logger';

// Zod schemas for validation
const ThreadMessageSchema = z.object({
  sender: z.string().min(1, 'Sender is required'),
  text: z.string().min(1, 'Text is required'),
  timestamp: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

const ProcessThreadSchema = z.object({
  thread: z
    .array(ThreadMessageSchema)
    .min(1, 'Thread must contain at least one message')
    .max(100, 'Thread cannot exceed 100 messages'),
  mode: z.enum(['github', 'notion', 'summary'], {
    errorMap: () => ({ message: 'Mode must be one of: github, notion, summary' }),
  }),
  options: z
    .object({
      repoName: z.string().optional(),
      branchName: z.string().optional(),
      notionDatabaseId: z.string().optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
      assignee: z.string().optional(),
    })
    .optional(),
});

// Generic validation middleware factory
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        logger.warn('Request validation failed', {
          url: req.url,
          method: req.method,
          errors: errorMessages,
        });

        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Request validation failed',
            details: errorMessages,
            timestamp: new Date().toISOString(),
          },
        });
      } else {
        logger.error('Unexpected validation error', { error });
        res.status(500).json({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Internal server error during validation',
            timestamp: new Date().toISOString(),
          },
        });
      }
    }
  };
}

// Specific validation middleware for process-thread endpoint
export const validateProcessThread = validateRequest(ProcessThreadSchema);

// Request size validation middleware
export function validateRequestSize(maxSizeKB: number = 100) {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.get('Content-Length') || '0', 10);
    const maxSizeBytes = maxSizeKB * 1024;

    if (contentLength > maxSizeBytes) {
      logger.warn('Request size too large', {
        contentLength,
        maxSizeBytes,
        url: req.url,
      });

      res.status(413).json({
        success: false,
        error: {
          code: 'REQUEST_TOO_LARGE',
          message: `Request size exceeds ${maxSizeKB}KB limit`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    next();
  };
}

// Rate limiting validation (basic implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function validateRateLimit(maxRequests: number = 60, windowMinutes: number = 1) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;

    const clientData = requestCounts.get(clientId);

    if (!clientData || now > clientData.resetTime) {
      requestCounts.set(clientId, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
      return;
    }

    if (clientData.count >= maxRequests) {
      const remainingTime = Math.ceil((clientData.resetTime - now) / 1000);
      
      logger.warn('Rate limit exceeded', {
        clientId,
        count: clientData.count,
        maxRequests,
        remainingTime,
      });

      res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests. Try again in ${remainingTime} seconds.`,
          details: {
            maxRequests,
            windowMinutes,
            retryAfter: remainingTime,
          },
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    clientData.count++;
    requestCounts.set(clientId, clientData);
    next();
  };
}

// Thread content validation
export function validateThreadContent(req: Request, res: Response, next: NextFunction) {
  const { thread } = req.body;
  
  if (!Array.isArray(thread)) {
    res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_THREAD',
        message: 'Thread must be an array of messages',
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  // Check for potentially harmful content
  const suspiciousPatterns = [
    /script\s*:/i,
    /javascript\s*:/i,
    /data\s*:/i,
    /<\s*script/i,
    /on\w+\s*=/i,
  ];

  const hasSuspiciousContent = thread.some((message: any) => 
    suspiciousPatterns.some(pattern => 
      pattern.test(message.text || '') || pattern.test(message.sender || '')
    )
  );

  if (hasSuspiciousContent) {
    logger.warn('Suspicious content detected in thread', {
      threadLength: thread.length,
      clientIp: req.ip,
    });

    res.status(400).json({
      success: false,
      error: {
        code: 'SUSPICIOUS_CONTENT',
        message: 'Thread contains potentially harmful content',
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  next();
}

// Clean up rate limit data periodically
setInterval(() => {
  const now = Date.now();
  for (const [clientId, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(clientId);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes