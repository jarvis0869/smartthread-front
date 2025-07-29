import { Thread, TeamMember, AnalyticsData } from '../types/index.js';

export const mockThreads: Thread[] = [
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
    status: "processed",
    createdAt: "2024-01-15T09:15:00Z",
    messageCount: 8,
    participants: ["alice.brown", "bob.wilson"],
    channel: "#design",
    outputs: {
      commitSummary: "feat: add dark mode theme with system preference detection",
      prTitle: "Implement dark mode theme toggle with accessibility support",
      hasMeetingSummary: false,
      taskCount: 5,
      processingTime: "1.8s"
    }
  },
  {
    id: "3",
    source: "slack",
    title: "Database optimization strategies",
    summary: "Discussion about optimizing database queries for better performance",
    status: "processing",
    createdAt: "2024-01-15T08:45:00Z",
    messageCount: 15,
    participants: ["david.lee", "emma.davis", "frank.miller"],
    channel: "#backend"
  },
  {
    id: "4",
    source: "teams",
    title: "UI/UX review for checkout flow",
    summary: "Review and feedback session for the new checkout flow design",
    status: "pending",
    createdAt: "2024-01-15T07:20:00Z",
    messageCount: 6,
    participants: ["grace.taylor", "henry.anderson"],
    channel: "#product"
  }
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Senior Frontend Developer",
    department: "Engineering",
    status: "online",
    joinDate: "2023-01-15",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
    lastActive: "2024-01-15T14:30:00Z",
    threadsParticipated: 42,
    tasksCompleted: 89
  },
  {
    id: "2",
    name: "Sarah Smith",
    email: "sarah.smith@company.com",
    role: "Backend Developer",
    department: "Engineering",
    status: "online",
    joinDate: "2023-03-10",
    location: "New York, NY",
    phone: "+1 (555) 234-5678",
    lastActive: "2024-01-15T14:25:00Z",
    threadsParticipated: 38,
    tasksCompleted: 76
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "DevOps Engineer",
    department: "Engineering",
    status: "away",
    joinDate: "2023-02-20",
    location: "Austin, TX",
    phone: "+1 (555) 345-6789",
    lastActive: "2024-01-15T13:45:00Z",
    threadsParticipated: 29,
    tasksCompleted: 54
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice.brown@company.com",
    role: "UX Designer",
    department: "Design",
    status: "online",
    joinDate: "2023-04-05",
    location: "Seattle, WA",
    phone: "+1 (555) 456-7890",
    lastActive: "2024-01-15T14:20:00Z",
    threadsParticipated: 33,
    tasksCompleted: 67
  },
  {
    id: "5",
    name: "Bob Wilson",
    email: "bob.wilson@company.com",
    role: "Product Manager",
    department: "Product",
    status: "offline",
    joinDate: "2023-01-30",
    location: "Boston, MA",
    phone: "+1 (555) 567-8901",
    lastActive: "2024-01-15T12:30:00Z",
    threadsParticipated: 51,
    tasksCompleted: 103
  }
];

export const mockAnalyticsData: AnalyticsData = {
  threadsProcessed: [
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
  ],
  processingTime: [
    { date: "Jan 1", avgTime: 2.1, maxTime: 4.2, minTime: 0.8 },
    { date: "Jan 2", avgTime: 1.9, maxTime: 3.8, minTime: 0.9 },
    { date: "Jan 3", avgTime: 2.3, maxTime: 5.1, minTime: 1.1 },
    { date: "Jan 4", avgTime: 1.8, maxTime: 3.2, minTime: 0.7 },
    { date: "Jan 5", avgTime: 2.0, maxTime: 4.5, minTime: 0.9 }
  ],
  sourceDistribution: [
    { source: "slack", count: 125, percentage: 62.5 },
    { source: "discord", count: 45, percentage: 22.5 },
    { source: "teams", count: 30, percentage: 15.0 }
  ],
  summary: {
    totalThreads: 342,
    totalTasks: 789,
    totalErrors: 12,
    avgProcessingTime: 2.1
  }
};