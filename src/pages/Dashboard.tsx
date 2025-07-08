import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, GitBranch, Calendar, ArrowRight, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for demo
const mockThreads = [
  {
    id: "1",
    source: "slack",
    title: "Authentication bug fix discussion",
    summary: "Team discussed a critical auth bug affecting user login",
    status: "processed",
    createdAt: "2024-01-15T10:30:00Z",
    messageCount: 12,
    outputs: {
      commitSummary: "fix: resolve auth token validation issue",
      prTitle: "Fix authentication token validation bug",
      hasMeetingSummary: true,
      taskCount: 3
    }
  },
  {
    id: "2", 
    source: "discord",
    title: "Feature planning: Dark mode",
    summary: "Planning discussion for implementing dark mode feature",
    status: "processing",
    createdAt: "2024-01-14T14:20:00Z",
    messageCount: 8,
    outputs: null
  },
  {
    id: "3",
    source: "whatsapp",
    title: "Database optimization meeting",
    summary: "Technical discussion about query optimization strategies",
    status: "processed",
    createdAt: "2024-01-13T09:15:00Z", 
    messageCount: 15,
    outputs: {
      commitSummary: "perf: optimize database queries for user dashboard",
      prTitle: "Performance improvements for dashboard queries",
      hasMeetingSummary: true,
      taskCount: 5
    }
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const filteredThreads = mockThreads.filter(thread => {
    const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thread.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || thread.status === statusFilter;
    const matchesSource = sourceFilter === "all" || thread.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed": return "bg-green-100 text-green-800 border-green-200";
      case "processing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getSourceIcon = (source: string) => {
    const iconClass = "h-4 w-4";
    switch (source) {
      case "slack": return <MessageSquare className={iconClass} />;
      case "discord": return <MessageSquare className={iconClass} />;
      case "whatsapp": return <MessageSquare className={iconClass} />;
      default: return <MessageSquare className={iconClass} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          AI-processed team conversations from Slack, Discord, and WhatsApp
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search threads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
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

      {/* Thread Cards */}
      <div className="grid gap-4">
        {filteredThreads.map((thread) => (
          <Card key={thread.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    {getSourceIcon(thread.source)}
                    <CardTitle className="text-lg">{thread.title}</CardTitle>
                    <Badge className={getStatusColor(thread.status)}>
                      {thread.status}
                    </Badge>
                  </div>
                  <CardDescription>{thread.summary}</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/thread/${thread.id}`)}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>{thread.messageCount} messages</span>
                  <span>
                    {new Date(thread.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {thread.outputs && (
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    <span>{thread.outputs.taskCount} tasks</span>
                    {thread.outputs.hasMeetingSummary && (
                      <>
                        <Calendar className="h-4 w-4 ml-2" />
                        <span>Meeting notes</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredThreads.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No threads found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters, or set up integrations to start processing threads.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}