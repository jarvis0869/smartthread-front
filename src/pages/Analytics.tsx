import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  MessageSquare,
  Loader2
} from "lucide-react";

// Mock analytics data for development/testing
const threadsProcessedData = [
  { date: "Jan 1", threads: 12, tasks: 34, errors: 2 },
  { date: "Jan 2", threads: 19, tasks: 45, errors: 1 },
  { date: "Jan 3", threads: 8, tasks: 23, errors: 3 },
  { date: "Jan 4", threads: 15, tasks: 38, errors: 0 },
  { date: "Jan 5", threads: 23, tasks: 52, errors: 1 },
  { date: "Jan 6", threads: 18, tasks: 41, errors: 2 },
  { date: "Jan 7", threads: 25, tasks: 58, errors: 0 },
  { date: "Jan 8", threads: 31, tasks: 67, errors: 1 },
  { date: "Jan 9", threads: 22, tasks: 49, errors: 2 },
  { date: "Jan 10", threads: 28, tasks: 61, errors: 0 },
  { date: "Jan 11", threads: 35, tasks: 78, errors: 1 },
  { date: "Jan 12", threads: 29, tasks: 64, errors: 3 },
  { date: "Jan 13", threads: 33, tasks: 71, errors: 0 },
  { date: "Jan 14", threads: 27, tasks: 59, errors: 1 },
  { date: "Jan 15", threads: 41, tasks: 89, errors: 0 }
];

const processingTimeData = [
  { hour: "00:00", avgTime: 2.1, maxTime: 4.2 },
  { hour: "03:00", avgTime: 1.8, maxTime: 3.1 },
  { hour: "06:00", avgTime: 2.3, maxTime: 4.8 },
  { hour: "09:00", avgTime: 3.2, maxTime: 6.1 },
  { hour: "12:00", avgTime: 3.8, maxTime: 7.2 },
  { hour: "15:00", avgTime: 3.5, maxTime: 6.8 },
  { hour: "18:00", avgTime: 2.9, maxTime: 5.4 },
  { hour: "21:00", avgTime: 2.4, maxTime: 4.6 }
];

const sourceDistributionData = [
  { name: "Slack", value: 65, color: "#8B5CF6" },
  { name: "Discord", value: 25, color: "#3B82F6" },
  { name: "WhatsApp", value: 10, color: "#10B981" }
];

const departmentActivityData = [
  { department: "Engineering", threads: 145, tasks: 289, completion: 92 },
  { department: "Product", threads: 78, tasks: 156, completion: 88 },
  { department: "Design", threads: 45, tasks: 98, completion: 95 },
  { department: "Marketing", threads: 32, tasks: 67, completion: 85 },
  { department: "Sales", threads: 28, tasks: 54, completion: 91 }
];

const taskCompletionData = [
  { date: "Week 1", completed: 245, pending: 67, overdue: 12 },
  { date: "Week 2", completed: 289, pending: 54, overdue: 8 },
  { date: "Week 3", completed: 312, pending: 43, overdue: 15 },
  { date: "Week 4", completed: 298, pending: 61, overdue: 9 }
];

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Calculate key metrics
  const totalThreads = threadsProcessedData.reduce((sum, day) => sum + day.threads, 0);
  const totalTasks = threadsProcessedData.reduce((sum, day) => sum + day.tasks, 0);
  const totalErrors = threadsProcessedData.reduce((sum, day) => sum + day.errors, 0);
  const avgProcessingTime = processingTimeData.reduce((sum, hour) => sum + hour.avgTime, 0) / processingTimeData.length;

  const yesterdayThreads = threadsProcessedData[threadsProcessedData.length - 2]?.threads || 0;
  const todayThreads = threadsProcessedData[threadsProcessedData.length - 1]?.threads || 0;
  const threadsGrowth = yesterdayThreads > 0 ? ((todayThreads - yesterdayThreads) / yesterdayThreads * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
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
            <h1 className="text-4xl font-bold tracking-tight">Analytics</h1>
            <p className="text-lg text-muted-foreground">
              Team productivity insights and SmartThread processing metrics
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Threads</p>
                <p className="text-3xl font-bold">{totalThreads}</p>
                <div className="flex items-center gap-1 mt-1">
                  {threadsGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${threadsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(threadsGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks Generated</p>
                <p className="text-3xl font-bold">{totalTasks}</p>
                <p className="text-sm text-green-600 font-medium">+12% from last week</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Processing Time</p>
                <p className="text-3xl font-bold">{avgProcessingTime.toFixed(1)}s</p>
                <p className="text-sm text-green-600 font-medium">-8% improvement</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                <p className="text-3xl font-bold">{((totalErrors / totalThreads) * 100).toFixed(1)}%</p>
                <p className="text-sm text-green-600 font-medium">-15% from last week</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threads Processed Over Time - Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Threads Processed Over Time</CardTitle>
              <CardDescription>Daily thread processing and task generation</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={threadsProcessedData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis 
                    fontSize={12}
                    tick={{ fill: 'currentColor' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      color: '#374151'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="threads" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Threads"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Tasks"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Source Distribution - Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Thread Sources</CardTitle>
              <CardDescription>Distribution of threads by communication platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sourceDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourceDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      color: '#374151'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Department Activity - Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Department Activity</CardTitle>
              <CardDescription>Thread participation and task completion by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentActivityData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="department" 
                    fontSize={12}
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis 
                    fontSize={12}
                    tick={{ fill: 'currentColor' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="threads" fill="hsl(var(--primary))" name="Threads" />
                  <Bar dataKey="tasks" fill="#10B981" name="Tasks" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Processing Time Trends - Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Processing Time by Hour</CardTitle>
              <CardDescription>Average and maximum processing times throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={processingTimeData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="hour" 
                    fontSize={12}
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis 
                    fontSize={12}
                    tick={{ fill: 'currentColor' }}
                    label={{ value: 'Time (seconds)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="avgTime" 
                    stackId="1" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                    name="Avg Time"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="maxTime" 
                    stackId="2" 
                    stroke="#EF4444" 
                    fill="#EF4444"
                    fillOpacity={0.3}
                    name="Max Time"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Task Completion Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Trends</CardTitle>
            <CardDescription>Weekly breakdown of task completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={taskCompletionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Bar dataKey="completed" fill="#10B981" name="Completed" />
                <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
                <Bar dataKey="overdue" fill="#EF4444" name="Overdue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Analytics Summary</CardTitle>
            <CardDescription>Key insights from your team's SmartThread usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">94.2%</div>
                <div className="text-sm text-muted-foreground">Processing Success Rate</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">2.1x</div>
                <div className="text-sm text-muted-foreground">Productivity Improvement</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-2">45min</div>
                <div className="text-sm text-muted-foreground">Avg Time Saved per Thread</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}