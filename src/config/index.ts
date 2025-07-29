import dotenv from 'dotenv';
import { AppConfig } from '@/types';
import { logger } from '@/utils/logger';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['OPENAI_API_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  logger.error('Missing required environment variables', { missingVars });
  process.exit(1);
}

// Build configuration object
export const config: AppConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
    model: process.env.OPENAI_MODEL || 'gpt-4-1106-preview',
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000', 10),
  },
  
  notion: {
    apiKey: process.env.NOTION_API_KEY || '',
    databaseId: process.env.NOTION_DATABASE_ID || '',
  },
  
  github: {
    token: process.env.GITHUB_TOKEN || '',
    defaultRepo: process.env.GITHUB_DEFAULT_REPO || '',
  },
};

// Validate optional integrations
export const integrations = {
  notion: {
    enabled: !!(config.notion.apiKey && config.notion.databaseId),
    configured: !!(config.notion.apiKey && config.notion.databaseId),
  },
  github: {
    enabled: !!config.github.token,
    configured: !!config.github.token,
  },
  slack: {
    enabled: !!(process.env.SLACK_BOT_TOKEN && process.env.SLACK_SIGNING_SECRET),
    configured: !!(process.env.SLACK_BOT_TOKEN && process.env.SLACK_SIGNING_SECRET),
  },
  discord: {
    enabled: !!process.env.DISCORD_BOT_TOKEN,
    configured: !!process.env.DISCORD_BOT_TOKEN,
  },
};

// Log configuration status
logger.info('Configuration loaded', {
  port: config.port,
  nodeEnv: config.nodeEnv,
  openaiModel: config.openai.model,
  integrations: Object.entries(integrations).reduce((acc, [key, value]) => {
    acc[key] = value.enabled ? 'enabled' : 'disabled';
    return acc;
  }, {} as Record<string, string>),
});

export default config;