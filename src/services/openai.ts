import OpenAI from 'openai';
import { config } from '@/config';
import { logger, logOpenAIRequest, logOpenAIResponse } from '@/utils/logger';
import {
  ThreadMessage,
  ProcessingMode,
  GitHubResponse,
  NotionResponse,
  SummaryResponse,
  OpenAIFunctionSchema,
} from '@/types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

// Function schemas for structured outputs
const githubFunctionSchema: OpenAIFunctionSchema = {
  name: 'generate_github_suggestions',
  description: 'Generate GitHub commit messages and PR suggestions from thread discussion',
  parameters: {
    type: 'object',
    properties: {
      commits: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'],
              description: 'Type of commit following conventional commits'
            },
            scope: {
              type: 'string',
              description: 'Optional scope of the commit'
            },
            description: {
              type: 'string',
              description: 'Brief description of the change'
            },
            body: {
              type: 'string',
              description: 'Optional detailed description'
            },
            breakingChange: {
              type: 'boolean',
              description: 'Whether this is a breaking change'
            }
          },
          required: ['type', 'description']
        }
      },
      pullRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Clear, descriptive PR title'
          },
          description: {
            type: 'string',
            description: 'Detailed PR description with context'
          },
          labels: {
            type: 'array',
            items: { type: 'string' },
            description: 'Relevant labels for the PR'
          },
          reviewers: {
            type: 'array',
            items: { type: 'string' },
            description: 'Suggested reviewers based on discussion'
          },
          assignees: {
            type: 'array',
            items: { type: 'string' },
            description: 'Suggested assignees'
          }
        },
        required: ['title', 'description', 'labels']
      },
      confidence: {
        type: 'number',
        description: 'Confidence score from 0 to 1',
        minimum: 0,
        maximum: 1
      }
    },
    required: ['commits', 'pullRequest', 'confidence']
  }
};

const notionFunctionSchema: OpenAIFunctionSchema = {
  name: 'generate_notion_tasks',
  description: 'Generate Notion tasks and action items from thread discussion',
  parameters: {
    type: 'object',
    properties: {
      tasks: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Clear, actionable task title'
            },
            description: {
              type: 'string',
              description: 'Detailed task description'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Task priority level'
            },
            status: {
              type: 'string',
              enum: ['not_started', 'in_progress', 'completed'],
              description: 'Current task status'
            },
            assignee: {
              type: 'string',
              description: 'Person assigned to the task'
            },
            dueDate: {
              type: 'string',
              description: 'Due date in ISO format'
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Relevant tags for categorization'
            },
            estimatedHours: {
              type: 'number',
              description: 'Estimated hours to complete'
            }
          },
          required: ['title', 'priority', 'status', 'tags']
        }
      },
      summary: {
        type: 'string',
        description: 'Brief summary of all tasks'
      },
      totalTasks: {
        type: 'number',
        description: 'Total number of tasks created'
      },
      confidence: {
        type: 'number',
        description: 'Confidence score from 0 to 1',
        minimum: 0,
        maximum: 1
      }
    },
    required: ['tasks', 'summary', 'totalTasks', 'confidence']
  }
};

const summaryFunctionSchema: OpenAIFunctionSchema = {
  name: 'generate_meeting_summary',
  description: 'Generate comprehensive meeting summary from thread discussion',
  parameters: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Descriptive title for the discussion/meeting'
      },
      summary: {
        type: 'string',
        description: 'Comprehensive summary of the discussion'
      },
      keyPoints: {
        type: 'array',
        items: { type: 'string' },
        description: 'Main points discussed'
      },
      actionItems: {
        type: 'array',
        items: { type: 'string' },
        description: 'Specific action items identified'
      },
      decisions: {
        type: 'array',
        items: { type: 'string' },
        description: 'Decisions made during discussion'
      },
      nextSteps: {
        type: 'array',
        items: { type: 'string' },
        description: 'Next steps to be taken'
      },
      participants: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of participants'
      },
      duration: {
        type: 'string',
        description: 'Estimated duration of discussion'
      },
      confidence: {
        type: 'number',
        description: 'Confidence score from 0 to 1',
        minimum: 0,
        maximum: 1
      }
    },
    required: ['title', 'summary', 'keyPoints', 'actionItems', 'decisions', 'nextSteps', 'participants', 'confidence']
  }
};

// Helper function to format thread for OpenAI
function formatThreadForPrompt(thread: ThreadMessage[]): string {
  return thread
    .map(msg => `${msg.sender}: ${msg.text}${msg.timestamp ? ` (${msg.timestamp})` : ''}`)
    .join('\n');
}

// Main processing function
export async function processThread(
  thread: ThreadMessage[],
  mode: ProcessingMode,
  options?: {
    repoName?: string;
    branchName?: string;
    notionDatabaseId?: string;
    priority?: 'low' | 'medium' | 'high';
    assignee?: string;
  }
): Promise<GitHubResponse | NotionResponse | SummaryResponse> {
  const startTime = Date.now();
  const threadText = formatThreadForPrompt(thread);
  
  logOpenAIRequest(config.openai.model, threadText.length, mode);

  try {
    let systemPrompt: string;
    let functionSchema: OpenAIFunctionSchema;

    switch (mode) {
      case 'github':
        systemPrompt = `You are an expert software developer and Git workflow specialist. Analyze the following thread discussion and generate:

1. Appropriate commit messages following conventional commits format
2. A comprehensive PR title and description
3. Relevant labels and suggested reviewers

Focus on technical accuracy and actionable development tasks. Consider the conversation context to understand what changes are being discussed.

${options?.repoName ? `Repository: ${options.repoName}` : ''}
${options?.branchName ? `Branch: ${options.branchName}` : ''}`;
        functionSchema = githubFunctionSchema;
        break;

      case 'notion':
        systemPrompt = `You are an expert project manager and task organizer. Analyze the following thread discussion and generate:

1. Clear, actionable tasks in Notion format
2. Appropriate priority levels and assignments
3. Relevant tags and categorization
4. Realistic time estimates

Focus on breaking down discussion points into specific, measurable tasks that can be tracked and completed.

${options?.priority ? `Default Priority: ${options.priority}` : ''}
${options?.assignee ? `Default Assignee: ${options.assignee}` : ''}`;
        functionSchema = notionFunctionSchema;
        break;

      case 'summary':
        systemPrompt = `You are an expert meeting facilitator and note-taker. Analyze the following thread discussion and generate:

1. A comprehensive summary of the conversation
2. Key points and decisions made
3. Action items and next steps
4. Clear organization for future reference

Focus on capturing the essence of the discussion and making it easily digestible for stakeholders who weren't present.`;
        functionSchema = summaryFunctionSchema;
        break;

      default:
        throw new Error(`Unsupported processing mode: ${mode}`);
    }

    const response = await openai.chat.completions.create({
      model: config.openai.model,
      temperature: config.openai.temperature,
      max_tokens: config.openai.maxTokens,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Please analyze the following thread discussion and provide structured output:\n\n${threadText}`,
        },
      ],
      functions: [
        {
          name: functionSchema.name,
          description: functionSchema.description,
          parameters: functionSchema.parameters,
        },
      ],
      function_call: { name: functionSchema.name },
    });

    const functionCall = response.choices[0]?.message?.function_call;
    if (!functionCall || !functionCall.arguments) {
      throw new Error('No function call response received from OpenAI');
    }

    const result = JSON.parse(functionCall.arguments);
    const duration = Date.now() - startTime;
    const tokensUsed = response.usage?.total_tokens || 0;

    logOpenAIResponse(config.openai.model, tokensUsed, duration, true);
    
    return result;

  } catch (error) {
    const duration = Date.now() - startTime;
    logOpenAIResponse(config.openai.model, 0, duration, false);
    
    logger.error('OpenAI processing failed', {
      mode,
      error: error instanceof Error ? error.message : 'Unknown error',
      threadLength: thread.length,
      duration,
    });
    
    throw new Error(`Failed to process thread: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Health check function for OpenAI service
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Health check' }],
      max_tokens: 5,
    });
    return !!response.choices[0]?.message?.content;
  } catch (error) {
    logger.error('OpenAI health check failed', { error });
    return false;
  }
}

export default {
  processThread,
  healthCheck,
};