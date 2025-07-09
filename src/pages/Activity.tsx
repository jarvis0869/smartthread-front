import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  GitCommit,
  MessageSquare,
  Users,
  Zap,
  Settings,
  Calendar,
  Activity as ActivityIcon
} from "lucide-react";

// Mock activity data
const mockActivities = [
  {
    id: "1",
    type: "thread_processed",
    title: "Thread processed successfully",
    description: "Authentication bug fix discussion processed in 2.3s",
    timestamp: "2024-01-15T10:33:00Z",
    status: "success",
    metadata: {
      threadId: "1",
      processingTime: "2.3s",
      outputsGenerated: 4
    }
  },
  {
    id: "2",
    type: "integration_connected",
    title: "Slack integration connected",
    description: "Successfully connected to Acme Corp Slack workspace",
    timestamp: "2024-01-15T09:15:00Z",
    status: "success",
    metadata: {
      integration: "slack",
      workspace: "Acme Corp"
    }
  },
  {
    id: "3",
    type: "thread_processing",
    title: "Processing new thread",
    description: "Dark mode implementation discussion is being processed",
    timestamp: "2024-01-14T14:22:00Z",
    status: "processing",
    metadata: {
      threadId: "2",
      estimatedTime: "3-5s"
    }
  },
  {
    id: "4",
    type: "thread_error",
    title: "Thread processing failed",
    description: "Security review thread failed due to API rate limit",
    timestamp: "2024-01-12T16:47:00Z",
    status: "error",
    metadata: {
      threadId: "4",
      error: "API_RATE_LIMIT_EXCEEDED"
    }
  },
  {
    id: "5",
    type: "integration_disconnected",
    title: "WhatsApp integration disconnected",
    description: "WhatsApp Business API connection lost due to expired token",
    timestamp: "2024-01-12T08:30:00Z",
    status: "warning",
    metadata: {
      integration: "whatsapp",
      reason: "TOKEN_EXPIRED"
    }
  },
  {
    id: "6",
    type: "settings_updated",
    title: "AI settings updated",
    description: "OpenAI model changed to GPT-4o and temperature adjusted",
    timestamp: "2024-01-11T15:20:00Z",
    status: "info",
    metadata: {
      changes: ["model", "temperature"]
    }
  }
];

export default function Activity() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  const getActivityConfig = (type: string, status: string) => {
    const configs = {
      thread_processed: {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-100"
      },
      thread_processing: {
        icon: Loader2,
        color: "text-blue-600",
        bgColor: "bg-blue-100"
      },
      thread_error: {
        icon: AlertCircle,
        color: "text-red-600",
        bgColor: "bg-red-100"
      },
      integration_connected: {
        icon: Zap,
        color: "text-green-600",
        bgColor: "bg-green-100"
      },
      integration_disconnected: {
        icon: AlertCircle,
        color: "text-orange-600",
        bgColor: "bg-orange-100"
      },
      settings_updated: {
        icon: Settings,
        color: "text-purple-600",
        bgColor: "bg-purple-100"
      }
    };

    return configs[type as keyof typeof configs] || {
      icon: ActivityIcon,
      color: "text-gray-600",
      bgColor: "bg-gray-100"
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700 border-green-200";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      case "warning":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "info":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading activity...</p>
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
            <h1 className="text-4xl font-bold tracking-tight">Activity</h1>
            <p className="text-lg text-muted-foreground">
              System events and integration activity log
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <ActivityIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {activities.map((activity, index) => {
          const config = getActivityConfig(activity.type, activity.status);
          const Icon = config.icon;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-2 rounded-full ${config.bgColor} flex-shrink-0`}>
                      <Icon className={`h-5 w-5 ${config.color} ${activity.status === 'processing' ? 'animate-spin' : ''}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground">{activity.title}</h3>
                            <Badge className={getStatusBadge(activity.status)}>
                              {activity.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {activity.description}
                          </p>

                          {/* Metadata */}
                          {activity.metadata && (
                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                              {activity.metadata.threadId && (
                                <span 
                                  className="cursor-pointer hover:text-primary"
                                  onClick={() => navigate(`/thread/${activity.metadata.threadId}`)}
                                >
                                  Thread ID: {activity.metadata.threadId}
                                </span>
                              )}
                              {activity.metadata.processingTime && (
                                <span>Processing time: {activity.metadata.processingTime}</span>
                              )}
                              {activity.metadata.integration && (
                                <span>Integration: {activity.metadata.integration}</span>
                              )}
                              {activity.metadata.workspace && (
                                <span>Workspace: {activity.metadata.workspace}</span>
                              )}
                              {activity.metadata.error && (
                                <span className="text-red-600">Error: {activity.metadata.error}</span>
                              )}
                              {activity.metadata.outputsGenerated && (
                                <span>Outputs: {activity.metadata.outputsGenerated}</span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground ml-4">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-muted-foreground">Threads Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">1</div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">2.8s</div>
                <div className="text-sm text-muted-foreground">Avg Processing</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}