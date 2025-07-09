import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Search, 
  Filter,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Loader2,
  Circle
} from "lucide-react";
import axios from "axios";

// Mock team data for development/testing
const mockTeamData = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Senior Frontend Developer",
    department: "Engineering",
    status: "online",
    avatar: null,
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
    avatar: null,
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
    avatar: null,
    joinDate: "2022-11-20",
    location: "Austin, TX",
    phone: "+1 (555) 345-6789",
    lastActive: "2024-01-15T13:45:00Z",
    threadsParticipated: 31,
    tasksCompleted: 68
  },
  {
    id: "4",
    name: "Alex Dev",
    email: "alex.dev@company.com",
    role: "QA Engineer",
    department: "Engineering",
    status: "offline",
    avatar: null,
    joinDate: "2023-06-05",
    location: "Seattle, WA",
    phone: "+1 (555) 456-7890",
    lastActive: "2024-01-15T12:00:00Z",
    threadsParticipated: 25,
    tasksCompleted: 54
  },
  {
    id: "5",
    name: "Lisa Wilson",
    email: "lisa.wilson@company.com",
    role: "UI/UX Designer",
    department: "Design",
    status: "online",
    avatar: null,
    joinDate: "2023-04-12",
    location: "Los Angeles, CA",
    phone: "+1 (555) 567-8901",
    lastActive: "2024-01-15T14:20:00Z",
    threadsParticipated: 29,
    tasksCompleted: 45
  },
  {
    id: "6",
    name: "David Chen",
    email: "david.chen@company.com",
    role: "Product Manager",
    department: "Product",
    status: "away",
    avatar: null,
    joinDate: "2022-09-01",
    location: "Denver, CO",
    phone: "+1 (555) 678-9012",
    lastActive: "2024-01-15T13:30:00Z",
    threadsParticipated: 56,
    tasksCompleted: 92
  },
  {
    id: "7",
    name: "Emma Rodriguez",
    email: "emma.rodriguez@company.com",
    role: "Data Scientist",
    department: "Engineering",
    status: "online",
    avatar: null,
    joinDate: "2023-08-20",
    location: "Chicago, IL",
    phone: "+1 (555) 789-0123",
    lastActive: "2024-01-15T14:35:00Z",
    threadsParticipated: 22,
    tasksCompleted: 37
  },
  {
    id: "8",
    name: "Tom Anderson",
    email: "tom.anderson@company.com",
    role: "Security Engineer",
    department: "Engineering",
    status: "offline",
    avatar: null,
    joinDate: "2022-12-15",
    location: "Boston, MA",
    phone: "+1 (555) 890-1234",
    lastActive: "2024-01-15T11:30:00Z",
    threadsParticipated: 18,
    tasksCompleted: 41
  }
];

export default function Teams() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/teams');
      setTeamMembers(response.data);
      setError(null);
    } catch (err) {
      console.log('Using mock data - backend not available');
      setTeamMembers(mockTeamData);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || member.department === departmentFilter;
    
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "online": 
        return { 
          className: "bg-green-100 text-green-700 border-green-200", 
          dot: "bg-green-500",
          text: "Online" 
        };
      case "away": 
        return { 
          className: "bg-yellow-100 text-yellow-700 border-yellow-200", 
          dot: "bg-yellow-500",
          text: "Away" 
        };
      case "offline": 
        return { 
          className: "bg-gray-100 text-gray-700 border-gray-200", 
          dot: "bg-gray-500",
          text: "Offline" 
        };
      default: 
        return { 
          className: "bg-gray-100 text-gray-700 border-gray-200", 
          dot: "bg-gray-500",
          text: "Unknown" 
        };
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatLastActive = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Get unique departments for filter
  const departments = [...new Set(teamMembers.map(member => member.department))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading team members...</p>
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
            <h1 className="text-4xl font-bold tracking-tight">Team</h1>
            <p className="text-lg text-muted-foreground">
              Manage team members and their activity across SmartThread
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>
      </motion.div>

      {/* Team Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                <p className="text-3xl font-bold">{teamMembers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Online Now</p>
                <p className="text-3xl font-bold text-green-600">
                  {teamMembers.filter(m => m.status === 'online').length}
                </p>
              </div>
              <Circle className="h-8 w-8 text-green-600 fill-current" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Departments</p>
                <p className="text-3xl font-bold">{departments.length}</p>
              </div>
              <Filter className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Threads</p>
                <p className="text-3xl font-bold">
                  {Math.round(teamMembers.reduce((acc, m) => acc + m.threadsParticipated, 0) / teamMembers.length)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col lg:flex-row gap-4 items-start lg:items-center"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-none focus:bg-background"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="away">Away</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Team Members Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredMembers.map((member, index) => {
          const statusConfig = getStatusConfig(member.status);

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        {member.avatar ? (
                          <AvatarImage src={member.avatar} alt={member.name} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusConfig.dot} rounded-full border-2 border-background`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{member.name}</CardTitle>
                      <CardDescription className="text-sm">{member.role}</CardDescription>
                      <Badge className={`${statusConfig.className} mt-2`}>
                        {statusConfig.text}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span>{member.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <span>{member.department}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-primary">{member.threadsParticipated}</div>
                        <div className="text-xs text-muted-foreground">Threads</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{member.tasksCompleted}</div>
                        <div className="text-xs text-muted-foreground">Tasks</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground text-center">
                    Last active: {formatLastActive(member.lastActive)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-dashed">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No team members found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Try adjusting your search or filters to find team members.
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setRoleFilter("all");
                setStatusFilter("all");
                setDepartmentFilter("all");
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}