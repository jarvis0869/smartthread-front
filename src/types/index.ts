// Core Thread Types
export interface ThreadMessage {
  sender: string;
  text: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface Thread {
  messages: ThreadMessage[];
  channelName?: string;
  platform?: 'slack' | 'discord' | 'whatsapp' | 'teams' | 'general';
  metadata?: Record<string, any>;
}

// Request/Response Types
export type ProcessingMode = 'github' | 'notion' | 'summary';

export interface ProcessThreadRequest {
  thread: ThreadMessage[];
  mode: ProcessingMode;
  options?: {
    repoName?: string;
    branchName?: string;
    notionDatabaseId?: string;
    priority?: 'low' | 'medium' | 'high';
    assignee?: string;
  };
}

// GitHub Mode Response Types
export interface GitHubCommitSuggestion {
  type: 'feat' | 'fix' | 'docs' | 'style' | 'refactor' | 'test' | 'chore';
  scope?: string;
  description: string;
  body?: string;
  breakingChange?: boolean;
}

export interface GitHubPRSuggestion {
  title: string;
  description: string;
  labels: string[];
  reviewers?: string[];
  assignees?: string[];
}

export interface GitHubResponse {
  commits: GitHubCommitSuggestion[];
  pullRequest: GitHubPRSuggestion;
  confidence: number;
}

// Notion Mode Response Types
export interface NotionTask {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed';
  assignee?: string;
  dueDate?: string;
  tags: string[];
  estimatedHours?: number;
}

export interface NotionResponse {
  tasks: NotionTask[];
  summary: string;
  totalTasks: number;
  confidence: number;
}

// Summary Mode Response Types
export interface SummaryResponse {
  title: string;
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  decisions: string[];
  nextSteps: string[];
  participants: string[];
  duration?: string;
  confidence: number;
}

// Unified Response Type
export interface ProcessThreadResponse {
  mode: ProcessingMode;
  success: boolean;
  data: GitHubResponse | NotionResponse | SummaryResponse;
  metadata: {
    processedAt: string;
    threadLength: number;
    processingTimeMs: number;
    model: string;
  };
}

// Error Types
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: APIError;
}

// API Integration Types
export interface SlackMessage {
  type: string;
  subtype?: string;
  text: string;
  user: string;
  ts: string;
  channel: string;
  thread_ts?: string;
}

export interface DiscordMessage {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    discriminator: string;
  };
  timestamp: string;
  channel_id: string;
  guild_id?: string;
}

// OpenAI Function Calling Schemas
export interface OpenAIFunctionSchema {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
}

// Service Configuration Types
export interface OpenAIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface NotionConfig {
  apiKey: string;
  databaseId: string;
}

export interface GitHubConfig {
  token: string;
  defaultRepo?: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  frontendUrl: string;
  openai: OpenAIConfig;
  notion: NotionConfig;
  github: GitHubConfig;
}