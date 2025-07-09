import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  MessageSquare, 
  GitCommit, 
  FileText, 
  CheckCircle2,
  Copy,
  ExternalLink,
  Download,
  Share,
  Loader2,
  AlertCircle,
  CheckCircle,
  Slack
} from "lucide-react";
import axios from "axios";

// Mock thread data with full conversation
const mockThreadData = {
  id: "1",
  source: "slack",
  title: "Authentication bug fix discussion",
  summary: "Team discussed a critical auth bug affecting user login across multiple environments. The issue was traced to JWT token validation in the middleware layer.",
  status: "processed",
  createdAt: "2024-01-15T10:30:00Z",
  messageCount: 12,
  participants: ["john.doe", "sarah.smith", "mike.johnson", "alex.dev"],
  channel: "#engineering",
  duration: "2h 15m",
  messages: [
    {
      id: "1",
      author: "john.doe",
      authorName: "John Doe",
      timestamp: "2024-01-15T10:30:00Z",
      content: "We're seeing JWT token validation failures in production. Users are getting logged out unexpectedly. This is happening across multiple environments.",
      type: "message"
    },
    {
      id: "2", 
      author: "sarah.smith",
      authorName: "Sarah Smith",
      timestamp: "2024-01-15T10:32:00Z",
      content: "I can reproduce this locally. It seems to happen when tokens are close to expiration. The middleware isn't handling the edge case properly.",
      type: "message"
    },
    {
      id: "3",
      author: "mike.johnson", 
      authorName: "Mike Johnson",
      timestamp: "2024-01-15T10:35:00Z",
      content: "The middleware isn't handling edge cases properly. We need to fix the validation logic. I think the issue is in the token expiration check.",
      type: "message"
    },
    {
      id: "4",
      author: "john.doe",
      authorName: "John Doe",
      timestamp: "2024-01-15T10:37:00Z",
      content: "Let's trace through the middleware code. The JWT validation should handle expired tokens gracefully, not just reject them.",
      type: "message"
    },
    {
      id: "5",
      author: "alex.dev",
      authorName: "Alex Dev",
      timestamp: "2024-01-15T10:40:00Z", 
      content: "I'll write comprehensive tests to cover all scenarios once the fix is ready. We should test edge cases like malformed tokens and expired tokens.",
      type: "message"
    },
    {
      id: "6",
      author: "sarah.smith",
      authorName: "Sarah Smith",
      timestamp: "2024-01-15T10:45:00Z",
      content: "Found the issue! The middleware is throwing an exception instead of returning a proper error response. Here's the problematic code section.",
      type: "message"
    },
    {
      id: "7",
      author: "mike.johnson",
      authorName: "Mike Johnson",
      timestamp: "2024-01-15T10:47:00Z",
      content: "Good catch! We need to wrap that in a try-catch and return a 401 status with a proper error message.",
      type: "message"
    },
    {
      id: "8",
      author: "john.doe",
      authorName: "John Doe",
      timestamp: "2024-01-15T10:50:00Z",
      content: "I'll create a fix for this. We should also add better logging so we can track these issues in the future.",
      type: "message"
    }
  ],
  outputs: {
    commitSummary: "fix: resolve auth token validation issue in JWT middleware\n\n- Fixed token expiration validation logic\n- Added proper error handling for malformed tokens\n- Updated middleware to handle edge cases\n- Added comprehensive tests for token validation\n\nCloses #123",
    prTitle: "Fix authentication token validation bug affecting user sessions",
    prDescription: "This PR addresses critical authentication issues identified in the team discussion:\n\n**Problem:** JWT token validation was failing for certain edge cases, causing users to be logged out unexpectedly.\n\n**Solution:**\n- Fixed token expiration validation logic\n- Added proper error handling for malformed tokens\n- Updated middleware to handle edge cases\n- Added comprehensive logging\n\n**Testing:** Added comprehensive unit tests for all token validation scenarios.\n\n**Impact:** This resolves authentication issues affecting ~5% of user sessions.",
    meetingSummary: {
      keyPoints: [
        "JWT token validation failing for certain edge cases",
        "Users experiencing unexpected logouts in production",
        "Issue affecting multiple environments",
        "Problem traced to middleware exception handling",
        "Need comprehensive testing strategy"
      ],
      decisions: [
        "Implement proper error handling in JWT middleware",
        "Add comprehensive unit tests for all scenarios",
        "Improve logging for better issue tracking",
        "Deploy fix to staging first for validation",
        "Monitor production metrics post-deployment"
      ],
      actionItems: [
        {
          task: "Fix JWT validation logic and exception handling",
          assignee: "john.doe",
          dueDate: "2024-01-16",
          status: "completed"
        },
        {
          task: "Write comprehensive unit tests for edge cases",
          assignee: "alex.dev", 
          dueDate: "2024-01-17",
          status: "in-progress"
        },
        {
          task: "Deploy to staging and validate fix",
          assignee: "mike.johnson",
          dueDate: "2024-01-18",
          status: "pending"
        },
        {
          task: "Set up monitoring and alerts for auth issues",
          assignee: "sarah.smith",
          dueDate: "2024-01-19",
          status: "pending"
        }
      ]
    },
    processingTime: "2.3s",
    confidence: 0.95
  }
};

export default function ThreadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [threadData, setThreadData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchThreadDetail();
  }, [id]);

  const fetchThreadDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/thread/${id}`);
      setThreadData(response.data);
      setError(null);
    } catch (err) {
      console.log('Using mock data - backend not available');
      setThreadData(mockThreadData);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, item: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed": return { className: "bg-green-100 text-green-700 border-green-200", text: "Completed" };
      case "in-progress": return { className: "bg-blue-100 text-blue-700 border-blue-200", text: "In Progress" };
      case "pending": return { className: "bg-yellow-100 text-yellow-700 border-yellow-200", text: "Pending" };
      default: return { className: "bg-gray-100 text-gray-700 border-gray-200", text: "Unknown" };
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading thread details...</p>
        </div>
      </div>
    );
  }

  if (!threadData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <p className="text-muted-foreground">Thread not found</p>
          <Button onClick={() => navigate('/threads')} className="mt-4">
            Back to Threads
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/threads")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Threads
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-2xl font-bold">{threadData.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Slack className="h-4 w-4" />
                {threadData.channel}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(threadData.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {threadData.duration}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thread Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Thread Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{threadData.summary}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Original Conversation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Original Conversation
                </CardTitle>
                <CardDescription>
                  {threadData.messageCount} messages from {threadData.participants.length} participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {threadData.messages.map((message: any, index: number) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="flex gap-3"
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {getInitials(message.authorName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-medium text-sm">{message.authorName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Generated Outputs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold">AI Generated Outputs</h2>
            
            {/* Commit Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GitCommit className="h-5 w-5" />
                    Git Commit Message
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopy(threadData.outputs.commitSummary, 'commit')}
                  >
                    {copiedItem === 'commit' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                  {threadData.outputs.commitSummary}
                </pre>
              </CardContent>
            </Card>

            {/* PR Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    Pull Request
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopy(`${threadData.outputs.prTitle}\n\n${threadData.outputs.prDescription}`, 'pr')}
                  >
                    {copiedItem === 'pr' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Title</h4>
                  <p className="text-sm bg-muted p-3 rounded-lg">{threadData.outputs.prTitle}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <pre className="text-sm bg-muted p-3 rounded-lg whitespace-pre-wrap">{threadData.outputs.prDescription}</pre>
                </div>
              </CardContent>
            </Card>

            {/* Meeting Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Meeting Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Key Points</h4>
                  <ul className="space-y-2">
                    {threadData.outputs.meetingSummary.keyPoints.map((point: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Decisions Made</h4>
                  <ul className="space-y-2">
                    {threadData.outputs.meetingSummary.decisions.map((decision: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{decision}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Action Items</h4>
                  <div className="space-y-3">
                    {threadData.outputs.meetingSummary.actionItems.map((item: any, index: number) => {
                      const statusConfig = getStatusConfig(item.status);
                      return (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{item.task}</span>
                            <Badge className={statusConfig.className}>
                              {statusConfig.text}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span>Assigned to: {item.assignee}</span>
                            <span className="mx-2">•</span>
                            <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Thread Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Thread Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Processed
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Source</span>
                  <span className="text-sm capitalize">{threadData.source}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Channel</span>
                  <span className="text-sm">{threadData.channel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Messages</span>
                  <span className="text-sm">{threadData.messageCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Processing Time</span>
                  <span className="text-sm">{threadData.outputs.processingTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Confidence</span>
                  <span className="text-sm">{Math.round(threadData.outputs.confidence * 100)}%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Participants */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participants ({threadData.participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {threadData.participants.map((participant: string) => (
                    <div key={participant} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {participant.split('.').map((n: string) => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{participant}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}