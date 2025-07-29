import { Router } from 'express';
import { mockThreads } from '../data/mockData.js';
import { ApiResponse, Thread } from '../types/index.js';

const router = Router();

// GET /api/threads - Get all threads
router.get('/', (req, res) => {
  try {
    const { status, source, limit = '50', offset = '0' } = req.query;
    
    let filteredThreads = [...mockThreads];
    
    // Filter by status if provided
    if (status && typeof status === 'string') {
      filteredThreads = filteredThreads.filter(thread => thread.status === status);
    }
    
    // Filter by source if provided
    if (source && typeof source === 'string') {
      filteredThreads = filteredThreads.filter(thread => thread.source === source);
    }
    
    // Apply pagination
    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);
    const paginatedThreads = filteredThreads.slice(offsetNum, offsetNum + limitNum);
    
    const response: ApiResponse<{
      threads: Thread[];
      total: number;
      limit: number;
      offset: number;
    }> = {
      success: true,
      data: {
        threads: paginatedThreads,
        total: filteredThreads.length,
        limit: limitNum,
        offset: offsetNum
      }
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch threads'
    };
    res.status(500).json(response);
  }
});

// GET /api/thread/:id - Get specific thread
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const thread = mockThreads.find(t => t.id === id);
    
    if (!thread) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Thread not found'
      };
      return res.status(404).json(response);
    }
    
    const response: ApiResponse<Thread> = {
      success: true,
      data: thread
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch thread'
    };
    res.status(500).json(response);
  }
});

// POST /api/threads - Create new thread (for future webhook integration)
router.post('/', (req, res) => {
  try {
    const threadData = req.body;
    
    // In a real implementation, this would validate and save to database
    const newThread: Thread = {
      id: `${Date.now()}`, // Simple ID generation for demo
      source: threadData.source || 'slack',
      title: threadData.title || 'Untitled Thread',
      summary: threadData.summary || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      messageCount: threadData.messageCount || 0,
      participants: threadData.participants || [],
      channel: threadData.channel
    };
    
    // Add to mock data (in memory for demo)
    mockThreads.unshift(newThread);
    
    const response: ApiResponse<Thread> = {
      success: true,
      data: newThread,
      message: 'Thread created successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create thread'
    };
    res.status(500).json(response);
  }
});

export default router;