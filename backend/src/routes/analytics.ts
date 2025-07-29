import { Router } from 'express';
import { mockAnalyticsData } from '../data/mockData.js';
import { ApiResponse, AnalyticsData } from '../types/index.js';

const router = Router();

// GET /api/analytics - Get all analytics data
router.get('/', (req, res) => {
  try {
    const response: ApiResponse<AnalyticsData> = {
      success: true,
      data: mockAnalyticsData
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch analytics data'
    };
    res.status(500).json(response);
  }
});

// GET /api/analytics/summary - Get analytics summary
router.get('/summary', (req, res) => {
  try {
    const response: ApiResponse<typeof mockAnalyticsData.summary> = {
      success: true,
      data: mockAnalyticsData.summary
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch analytics summary'
    };
    res.status(500).json(response);
  }
});

// GET /api/analytics/threads-processed - Get threads processed over time
router.get('/threads-processed', (req, res) => {
  try {
    const { period = '15' } = req.query;
    const periodNum = parseInt(period as string, 10);
    
    // Return last N days of data
    const data = mockAnalyticsData.threadsProcessed.slice(-periodNum);
    
    const response: ApiResponse<typeof data> = {
      success: true,
      data
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch threads processed data'
    };
    res.status(500).json(response);
  }
});

// GET /api/analytics/processing-time - Get processing time metrics
router.get('/processing-time', (req, res) => {
  try {
    const response: ApiResponse<typeof mockAnalyticsData.processingTime> = {
      success: true,
      data: mockAnalyticsData.processingTime
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch processing time data'
    };
    res.status(500).json(response);
  }
});

// GET /api/analytics/source-distribution - Get source distribution
router.get('/source-distribution', (req, res) => {
  try {
    const response: ApiResponse<typeof mockAnalyticsData.sourceDistribution> = {
      success: true,
      data: mockAnalyticsData.sourceDistribution
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch source distribution data'
    };
    res.status(500).json(response);
  }
});

export default router;