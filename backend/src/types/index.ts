export interface Thread {
  id: string;
  source: 'slack' | 'discord' | 'teams';
  title: string;
  summary: string;
  status: 'pending' | 'processing' | 'processed' | 'error';
  createdAt: string;
  messageCount: number;
  participants: string[];
  channel?: string;
  outputs?: {
    commitSummary?: string;
    prTitle?: string;
    hasMeetingSummary?: boolean;
    taskCount?: number;
    processingTime?: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'online' | 'offline' | 'away';
  avatar?: string;
  joinDate: string;
  location?: string;
  phone?: string;
  lastActive: string;
  threadsParticipated: number;
  tasksCompleted: number;
}

export interface AnalyticsData {
  threadsProcessed: Array<{
    date: string;
    threads: number;
    tasks: number;
    errors: number;
  }>;
  processingTime: Array<{
    date: string;
    avgTime: number;
    maxTime: number;
    minTime: number;
  }>;
  sourceDistribution: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  summary: {
    totalThreads: number;
    totalTasks: number;
    totalErrors: number;
    avgProcessingTime: number;
  };
}

export interface Integration {
  id: string;
  name: string;
  type: 'slack' | 'github' | 'notion' | 'discord';
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, any>;
  lastSync?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}