import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, 
  GitCommit, 
  Calendar, 
  ArrowRight, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Slack,
  MessageCircle,
  Hash,
  Users
} from "lucide-react";
import axios from "axios";

// Mock data for when backend is not available
const mockThreads = [
  {
    id: "1",
    source: "slack",
    title: "Authentication bug fix discussion",
    summary: "Team discussed a critical auth bug affecting user login across multiple environments",
    status: "processed",
    createdAt: "2024-01-15T10:30:00Z",
    messageCount: 12,
    participants: ["john.doe", "sarah.smith", "mike.johnson"],
    channel: "#engineering",
    outputs: {
      commitSummary: "fix: resolve auth token validation issue in JWT middleware",
      prTitle: "Fix authentication token validation bug affecting user sessions",
      hasMeetingSummary: true,
      taskCount: 3,
      processingTime: "2.3s"
    }
  },
  {
    id: "2", 
    source: "discord",
    title: "Feature planning: Dark mode implementation",
    summary: "Planning discussion for implementing dark mode feature with accessibility considerations",
    status: "processing",
    createdAt: "2024-01-14T14:20:00Z",
    messageCount: 8,
    participants: ["alex.dev", "ui.designer"],
    channel: "general",
    outputs: null
  },
  {
    id: "3",
    source: "whatsapp",
    title: "Database optimization meeting",
    summary: "Technical discussion about query optimization strategies and performance improvements",
    status: "processed",
    createdAt: "2024-01-13T09:15:00Z", 
    messageCount: 15,
    participants: ["db.admin", "backend.dev", "devops.lead"],
    channel: "Dev Team",
    outputs: {
      commitSummary: "perf: optimize database queries for user dashboard and analytics",
      prTitle: "Performance improvements for dashboard queries - 40% faster load times",
      hasMeetingSummary: true,
      taskCount: 5,
      processingTime: "3.1s"
    }
  },
  {
    id: "4",
    source: "slack",
    title: "Security review findings",
    summary: "Critical security vulnerabilities identified during quarterly review",
    status: "error",
    createdAt: "2024-01-12T16:45:00Z",
    messageCount: 6,
    participants: ["security.lead", "cto"],
    channel: "#security",
    outputs: null
  },
  {
    id: "5",
    source: "discord",
    title: "API rate limiting discussion",
    summary: "Team discussing implementation of rate limiting for our public API endpoints",
    status: "processed",
    createdAt: "2024-01-11T11:20:00Z",
    messageCount: 18,
    participants: ["api.lead", "backend.dev", "product.manager"],
    channel: "backend",
    outputs: {
      commitSummary: "feat: implement rate limiting middleware for API endpoints",
      prTitle: "Add rate limiting protection to public API endpoints",
      hasMeetingSummary: true,
      taskCount: 4,
      processingTime: "3.7s"
    }
  }
];

function Threads() {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      console.log('Fetching threads from /api/threads...');
      const response = await axios.get('/api/threads');
      console.log('Threads API response:', response.data);
      setThreads(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.log('Threads API failed, using mock data. Error:', err);
      setThreads(mockThreads);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const filteredThreads = threads.filter(thread => {
    const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thread.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || thread.status === statusFilter;
    const matchesSource = sourceFilter === "all" || thread.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "processed": 
        return { 
          className: "bg-green-100 text-green-700 border-green-200", 
          icon: CheckCircle,
          text: "Processed" 
        };
      case "processing": 
        return { 
          className: "bg-blue-100 text-blue-700 border-blue-200", 
          icon: Loader2,
          text: "Processing" 
        };
      case "error": 
        return { 
          className: "bg-red-100 text-red-700 border-red-200", 
          icon: AlertCircle,
          text: "Error" 
        };
      default: 
        return { 
          className: "bg-gray-100 text-gray-700 border-gray-200", 
          icon: Clock,
          text: "Pending" 
        };
    }
  };

  const getSourceConfig = (source: string) => {
    switch (source) {
      case "slack": return { icon: Slack, color: "text-purple-600", name: "Slack" };
      case "discord": return { icon: MessageCircle, color: "text-indigo-600", name: "Discord" };
      case "whatsapp": return { icon: MessageSquare, color: "text-green-600", name: "WhatsApp" };
      default: return { icon: Hash, color: "text-gray-600", name: "Unknown" };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading threads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">All Threads</h1>
            <p className="text-lg text-muted-foreground">
              View and manage all processed conversation threads
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Process New Thread
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between"
      >
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search threads, summaries, or participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-none focus:bg-background"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="slack">Slack</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Threads Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {filteredThreads.map((thread, index) => {
          const statusConfig = getStatusConfig(thread.status);
          const sourceConfig = getSourceConfig(thread.source);
          const StatusIcon = statusConfig.icon;
          const SourceIcon = sourceConfig.icon;

          return (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group" onClick={() => navigate(`/thread/${thread.id}`)}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-muted/50 ${sourceConfig.color}`}>
                          <SourceIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {thread.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`${statusConfig.className} flex items-center gap-1`}>
                              <StatusIcon className={`h-3 w-3 ${thread.status === 'processing' ? 'animate-spin' : ''}`} />
                              {statusConfig.text}
                            </Badge>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{sourceConfig.name}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{thread.channel}</span>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-base leading-relaxed">
                        {thread.summary}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{thread.messageCount} messages</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{thread.participants.length} participants</span>
                      </div>
                    </div>
                    {thread.outputs && (
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-green-600">
                          <GitCommit className="h-4 w-4" />
                          <span>{thread.outputs.taskCount} tasks</span>
                        </div>
                        {thread.outputs.hasMeetingSummary && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <Calendar className="h-4 w-4" />
                            <span>Meeting notes</span>
                          </div>
                        )}
                        <div className="text-muted-foreground">
                          {thread.outputs.processingTime}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {filteredThreads.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-dashed">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No threads found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Try adjusting your search or filters, or process some new threads to get started.
              </p>
              <Button onClick={() => navigate('/integrations')}>
                Set up integrations
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

export default Threads;