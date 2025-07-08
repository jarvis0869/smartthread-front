import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Copy, 
  MessageSquare, 
  GitBranch, 
  Calendar, 
  CheckSquare,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app this would come from API
const mockThreadData = {
  "1": {
    id: "1",
    source: "slack",
    title: "Authentication bug fix discussion",
    summary: "Team discussed a critical auth bug affecting user login. Identified the root cause in token validation and planned the fix implementation.",
    status: "processed",
    createdAt: "2024-01-15T10:30:00Z",
    messageCount: 12,
    participants: ["John Doe", "Jane Smith", "Mike Wilson"],
    originalMessages: [
      { author: "John Doe", content: "We're seeing auth failures in production", timestamp: "10:30" },
      { author: "Jane Smith", content: "I can reproduce this - looks like token validation is broken", timestamp: "10:32" },
      { author: "Mike Wilson", content: "I'll create a fix for this today", timestamp: "10:35" }
    ],
    outputs: {
      commitSummary: "fix: resolve auth token validation issue in middleware",
      prTitle: "Fix authentication token validation bug affecting user login",
      meetingSummary: "**Authentication Bug Fix Discussion**\n\n**Problem:** Users experiencing login failures due to token validation issue\n\n**Root Cause:** Middleware not properly validating JWT tokens\n\n**Action Items:**\n- Fix token validation logic\n- Add better error handling\n- Deploy hotfix to production\n\n**Next Steps:** Monitor error rates after deployment",
      tasks: [
        { title: "Fix JWT token validation in auth middleware", priority: "high", assignee: "Mike Wilson" },
        { title: "Add comprehensive error handling for auth failures", priority: "medium", assignee: "Jane Smith" },
        { title: "Create monitoring dashboard for auth errors", priority: "low", assignee: "John Doe" }
      ]
    }
  }
};

export default function ThreadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const thread = mockThreadData[id as keyof typeof mockThreadData];

  if (!thread) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Thread not found</h2>
        <p className="text-muted-foreground mb-4">The requested thread could not be found.</p>
        <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
      </div>
    );
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied to your clipboard.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed": return "bg-green-100 text-green-800 border-green-200";
      case "processing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <Badge className={getStatusColor(thread.status)}>
          {thread.status}
        </Badge>
      </div>

      {/* Thread Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {thread.title}
              </CardTitle>
              <CardDescription className="mt-2">
                {thread.summary}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Source: {thread.source}</span>
            <span>{thread.messageCount} messages</span>
            <span>{new Date(thread.createdAt).toLocaleString()}</span>
            <span>Participants: {thread.participants.join(", ")}</span>
          </div>
        </CardHeader>
      </Card>

      {/* Generated Outputs */}
      <div className="grid gap-6">
        {/* Commit Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Git Commit Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
              {thread.outputs.commitSummary}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => copyToClipboard(thread.outputs.commitSummary, "Commit summary")}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </CardContent>
        </Card>

        {/* PR Title */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Pull Request Title
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4">
              {thread.outputs.prTitle}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => copyToClipboard(thread.outputs.prTitle, "PR title")}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
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
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-wrap">
              {thread.outputs.meetingSummary}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => copyToClipboard(thread.outputs.meetingSummary, "Meeting summary")}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Generated Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {thread.outputs.tasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">Assigned to: {task.assignee}</p>
                  </div>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Original Thread */}
      <Card>
        <CardHeader>
          <CardTitle>Original Thread</CardTitle>
          <CardDescription>
            The original conversation that was processed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {thread.originalMessages.map((message, index) => (
              <div key={index} className="border-l-2 border-muted pl-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">{message.author}</span>
                  <span>{message.timestamp}</span>
                </div>
                <p className="mt-1">{message.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}