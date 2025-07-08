import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Github, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Integrations() {
  const { toast } = useToast();
  const [slackConfig, setSlackConfig] = useState({
    apiToken: "",
    channelId: "",
    webhookUrl: ""
  });
  const [githubConfig, setGithubConfig] = useState({
    apiToken: "",
    owner: "",
    repo: ""
  });
  const [notionConfig, setNotionConfig] = useState({
    apiToken: "",
    databaseId: ""
  });

  // Mock connection status
  const [connectionStatus] = useState({
    slack: "connected",
    github: "disconnected", 
    notion: "connected"
  });

  const handleSlackSave = () => {
    toast({
      title: "Slack Configuration Saved",
      description: "Your Slack integration settings have been updated.",
    });
  };

  const handleGithubSave = () => {
    toast({
      title: "GitHub Configuration Saved", 
      description: "Your GitHub integration settings have been updated.",
    });
  };

  const handleNotionSave = () => {
    toast({
      title: "Notion Configuration Saved",
      description: "Your Notion integration settings have been updated.",
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === "connected") {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Connected
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200">
        <AlertCircle className="h-3 w-3 mr-1" />
        Disconnected
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">
          Connect your team communication and productivity tools
        </p>
      </div>

      <Tabs defaultValue="slack" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="slack" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Slack
          </TabsTrigger>
          <TabsTrigger value="github" className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            GitHub
          </TabsTrigger>
          <TabsTrigger value="notion" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notion
          </TabsTrigger>
        </TabsList>

        <TabsContent value="slack">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Slack Integration
                  </CardTitle>
                  <CardDescription>
                    Connect to Slack to process team conversations
                  </CardDescription>
                </div>
                {getStatusBadge(connectionStatus.slack)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slack-token">Bot User OAuth Token</Label>
                <Input
                  id="slack-token"
                  type="password"
                  placeholder="xoxb-..."
                  value={slackConfig.apiToken}
                  onChange={(e) => setSlackConfig({...slackConfig, apiToken: e.target.value})}
                />
                <p className="text-sm text-muted-foreground">
                  Create a Slack app and add the bot scope to get this token
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slack-channel">Channel ID</Label>
                <Input
                  id="slack-channel"
                  placeholder="C1234567890"
                  value={slackConfig.channelId}
                  onChange={(e) => setSlackConfig({...slackConfig, channelId: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slack-webhook">Webhook URL (Optional)</Label>
                <Input
                  id="slack-webhook"
                  placeholder="https://hooks.slack.com/services/..."
                  value={slackConfig.webhookUrl}
                  onChange={(e) => setSlackConfig({...slackConfig, webhookUrl: e.target.value})}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSlackSave}>Save Configuration</Button>
                <Button variant="outline" asChild>
                  <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Create Slack App
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="github">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    GitHub Integration
                  </CardTitle>
                  <CardDescription>
                    Push generated commit summaries and PR titles to GitHub
                  </CardDescription>
                </div>
                {getStatusBadge(connectionStatus.github)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github-token">Personal Access Token</Label>
                <Input
                  id="github-token"
                  type="password"
                  placeholder="ghp_..."
                  value={githubConfig.apiToken}
                  onChange={(e) => setGithubConfig({...githubConfig, apiToken: e.target.value})}
                />
                <p className="text-sm text-muted-foreground">
                  Generate a token with repo access permissions
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github-owner">Repository Owner</Label>
                  <Input
                    id="github-owner"
                    placeholder="username or org"
                    value={githubConfig.owner}
                    onChange={(e) => setGithubConfig({...githubConfig, owner: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github-repo">Repository Name</Label>
                  <Input
                    id="github-repo"
                    placeholder="repository-name"
                    value={githubConfig.repo}
                    onChange={(e) => setGithubConfig({...githubConfig, repo: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleGithubSave}>Save Configuration</Button>
                <Button variant="outline" asChild>
                  <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Generate Token
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notion">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Notion Integration
                  </CardTitle>
                  <CardDescription>
                    Create tasks and meeting docs in Notion databases
                  </CardDescription>
                </div>
                {getStatusBadge(connectionStatus.notion)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notion-token">Integration Token</Label>
                <Input
                  id="notion-token"
                  type="password"
                  placeholder="secret_..."
                  value={notionConfig.apiToken}
                  onChange={(e) => setNotionConfig({...notionConfig, apiToken: e.target.value})}
                />
                <p className="text-sm text-muted-foreground">
                  Create an internal integration in your Notion workspace
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notion-database">Database ID</Label>
                <Input
                  id="notion-database"
                  placeholder="32-character database ID"
                  value={notionConfig.databaseId}
                  onChange={(e) => setNotionConfig({...notionConfig, databaseId: e.target.value})}
                />
                <p className="text-sm text-muted-foreground">
                  Found in the database URL after the last slash
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleNotionSave}>Save Configuration</Button>
                <Button variant="outline" asChild>
                  <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Create Integration
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}