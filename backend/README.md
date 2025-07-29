# Thread Processor Backend API

A Node.js/Express backend API for the Thread Processor application that handles thread management, team members, and analytics data.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

4. **Start development server:**
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## 📋 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔗 API Endpoints

### Health Check
- `GET /health` - Server health status

### Threads
- `GET /api/threads` - Get all threads (supports filtering and pagination)
  - Query params: `status`, `source`, `limit`, `offset`
- `GET /api/thread/:id` - Get specific thread by ID
- `POST /api/threads` - Create new thread

### Teams
- `GET /api/teams` - Get all team members (supports filtering and pagination)
  - Query params: `department`, `status`, `limit`, `offset`
- `GET /api/teams/:id` - Get specific team member by ID
- `POST /api/teams` - Add new team member
- `PUT /api/teams/:id` - Update team member

### Analytics
- `GET /api/analytics` - Get all analytics data
- `GET /api/analytics/summary` - Get analytics summary
- `GET /api/analytics/threads-processed` - Get threads processed over time
- `GET /api/analytics/processing-time` - Get processing time metrics
- `GET /api/analytics/source-distribution` - Get source distribution data

## 📊 Response Format

All API responses follow this format:

```json
{
  "success": boolean,
  "data": any,           // Present on success
  "error": string,       // Present on error
  "message": string      // Optional success message
}
```

## 🔧 Configuration

Environment variables (see `.env.example`):

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed CORS origin (default: http://localhost:5173)

## 🛠 Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Development**: tsx (TypeScript runner)

## 📁 Project Structure

```
backend/
├── src/
│   ├── data/           # Mock data
│   ├── middleware/     # Express middleware
│   ├── routes/         # API route handlers
│   ├── types/          # TypeScript type definitions
│   └── server.ts       # Main server file
├── dist/               # Compiled JavaScript (after build)
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 Testing the API

You can test the API using curl or any HTTP client:

```bash
# Health check
curl http://localhost:3001/health

# Get all threads
curl http://localhost:3001/api/threads

# Get specific thread
curl http://localhost:3001/api/thread/1

# Get team members
curl http://localhost:3001/api/teams

# Get analytics
curl http://localhost:3001/api/analytics
```

## 🔄 Data Flow

Currently uses in-memory mock data for demonstration. In production, you would:

1. Replace mock data with a real database (PostgreSQL, MongoDB, etc.)
2. Add authentication/authorization middleware
3. Implement proper data validation
4. Add rate limiting
5. Set up logging and monitoring

## 🚧 Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- Authentication & authorization
- Input validation with Joi
- Rate limiting
- Real-time updates with WebSocket
- Integration with Slack/Discord/Teams APIs
- Automated testing suite
- Docker containerization

## 📝 License

MIT License