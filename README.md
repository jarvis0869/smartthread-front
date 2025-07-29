# SmartThread Backend

Production-grade backend for SmartThread AI tool that processes threads of messages (Slack, Discord, WhatsApp-style) and intelligently generates:

- Git commit messages and PR suggestions
- Notion tasks and action items  
- Meeting summaries and action points

## 🚀 Features

- **AI-Powered Processing**: Uses OpenAI GPT-4 with function calling for structured outputs
- **Multiple Modes**: GitHub, Notion, and Summary processing modes
- **Type Safety**: Full TypeScript implementation with comprehensive types
- **Production Ready**: Express server with CORS, security headers, rate limiting
- **Comprehensive Logging**: Winston-based logging with different levels
- **Input Validation**: Zod schemas for request validation
- **Error Handling**: Structured error responses with proper HTTP status codes
- **API Integrations**: Stub implementations for Slack, Discord, Notion, GitHub
- **Health Monitoring**: Built-in health checks and service monitoring

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- OpenAI API key
- Optional: Notion, GitHub, Slack, Discord API credentials

## ⚡ Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd smartthread-backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Production**
   ```bash
   npm run build
   npm start
   ```

## 🔧 Environment Variables

### Required
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Optional Integrations
```env
# Notion
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_notion_database_id_here

# GitHub
GITHUB_TOKEN=your_github_token_here

# Slack (Future)
SLACK_BOT_TOKEN=your_slack_bot_token_here
SLACK_SIGNING_SECRET=your_slack_signing_secret_here

# Discord (Future)
DISCORD_BOT_TOKEN=your_discord_bot_token_here
```

### Server Configuration
```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
```

## 📖 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### `POST /api/process-thread`
Process a thread of messages based on the specified mode.

**Request Body:**
```json
{
  "thread": [
    {
      "sender": "Alice",
      "text": "Fixed the login bug, ready for review",
      "timestamp": "2024-01-01T10:00:00Z"
    },
    {
      "sender": "Bob", 
      "text": "Great! I'll test it and merge if all looks good"
    }
  ],
  "mode": "github",
  "options": {
    "repoName": "myorg/myrepo",
    "branchName": "feature/login-fix"
  }
}
```

**Response:**
```json
{
  "mode": "github",
  "success": true,
  "data": {
    "commits": [
      {
        "type": "fix",
        "scope": "auth",
        "description": "resolve login authentication issue",
        "body": "Fixed authentication flow that was preventing users from logging in",
        "breakingChange": false
      }
    ],
    "pullRequest": {
      "title": "Fix: Resolve login authentication issue",
      "description": "This PR fixes the login bug that was preventing users from authenticating...",
      "labels": ["bug", "authentication", "frontend"],
      "reviewers": ["Bob"],
      "assignees": ["Alice"]
    },
    "confidence": 0.92
  },
  "metadata": {
    "processedAt": "2024-01-01T10:05:00Z",
    "threadLength": 2,
    "processingTimeMs": 1500,
    "model": "gpt-4-1106-preview"
  }
}
```

#### `GET /api/health`
Check API and service health status.

#### `GET /api/modes`
Get available processing modes and examples.

#### `GET /api/integrations`
Get status of external integrations.

### Processing Modes

#### GitHub Mode (`mode: "github"`)
Generates commit messages and PR suggestions following conventional commits format.

**Options:**
- `repoName`: Target repository name
- `branchName`: Feature branch name

**Output:** Structured commit messages and PR details

#### Notion Mode (`mode: "notion"`)
Creates actionable tasks and project items.

**Options:**
- `priority`: Default priority level (low/medium/high)
- `assignee`: Default assignee name
- `notionDatabaseId`: Target Notion database

**Output:** Structured tasks with priorities, assignments, and tags

#### Summary Mode (`mode: "summary"`)
Generates comprehensive meeting summaries.

**Output:** Meeting summary with key points, decisions, and action items

## 🏗️ Project Structure

```
src/
├── config/           # Configuration and environment setup
├── controllers/      # Request handlers and business logic  
├── middleware/       # Express middleware (validation, errors)
├── routes/          # API route definitions
├── services/        # External service integrations
├── types/           # TypeScript type definitions
├── utils/           # Utility functions and helpers
└── server.ts        # Main application entry point
```

## 🚀 Deployment

### Render/Railway Deployment

1. **Build Command:**
   ```bash
   npm run build
   ```

2. **Start Command:**
   ```bash
   npm start
   ```

3. **Environment Variables:**
   Set all required environment variables in your deployment platform.

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

### Health Checks

The API provides health check endpoints for monitoring:

- `GET /health` - Basic health status
- `GET /api/health` - Detailed service health including OpenAI connectivity

## 🔒 Security Features

- **Helmet.js**: Security headers and XSS protection
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Request rate limiting per IP
- **Input Validation**: Comprehensive request validation with Zod
- **Content Security Policy**: Strict CSP headers
- **Request Size Limits**: Maximum payload size enforcement

## 📊 Monitoring & Logging

- **Winston Logging**: Structured logging with multiple transports
- **Request Logging**: Detailed HTTP request/response logging  
- **Error Tracking**: Comprehensive error logging and handling
- **Performance Metrics**: Request timing and OpenAI usage tracking

## 🧪 Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Quality
- **TypeScript**: Full type safety with strict configuration
- **ESLint**: Code linting and style enforcement
- **Path Aliases**: Clean imports using @ aliases

## 🔮 Future Integrations

The backend includes stub implementations for:

- **Slack API**: Thread fetching and message posting
- **Discord API**: Channel message retrieval and sending
- **Notion API**: Task creation and database queries
- **GitHub API**: PR creation and commit suggestions

These can be easily activated by implementing the actual API calls in the service files.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

ISC License - see LICENSE file for details.
