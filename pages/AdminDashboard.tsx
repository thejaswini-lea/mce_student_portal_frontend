import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Users, 
  Calendar, 
  Award, 
  Plus,
  BookOpen,
  Trophy,
  Briefcase,
  TrendingUp,
  Settings,
  LogOut,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Star,
  Zap
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const AdminDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    type: "",
    points: "",
    department: "",
    date: "",
    maxParticipants: ""
  });

  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeEvents: 0,
    totalPointsAwarded: 0,
    departments: 0
  });
  const [analytics, setAnalytics] = useState({
    departmentStats: [],
    levelDistribution: [],
    eventParticipation: [],
    topPerformers: [],
    monthlyProgress: []
  });
  const [awardForm, setAwardForm] = useState({
    eventId: "",
    userId: "",
    points: ""
  });
  const [awardingPoints, setAwardingPoints] = useState(false);

  // Check authentication and admin role
  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Access Denied",
        description: "Please log in to access the admin dashboard.",
        variant: "destructive"
      });
      navigate("/admin-login");
      return;
    }

    if (user.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive"
      });
      navigate("/");
      return;
    }
  }, [isAuthenticated, user, navigate, toast]);

  // Fetch events for display
  const fetchEvents = async () => {
    try {
      const response = await apiService.getEvents({ limit: 20 });
      if (response.success) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Fetch students for display
  const fetchStudents = async () => {
    try {
      setStudentsLoading(true);
      const response = await apiService.getUsers({ 
        role: 'student', 
        limit: 50 
      });
      if (response.success) {
        setStudents(response.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load students data",
        variant: "destructive"
      });
    } finally {
      setStudentsLoading(false);
    }
  };

  // Calculate statistics from fetched data
  const calculateStats = () => {
    const totalStudents = students.length;
    const activeEvents = events.filter(event => event.status === 'upcoming' || event.status === 'ongoing').length;
    const totalPointsAwarded = students.reduce((sum, student) => sum + (student.totalPoints || 0), 0);
    const departments = new Set(students.map(student => student.department).filter(Boolean)).size;

    setStats({
      totalStudents,
      activeEvents,
      totalPointsAwarded,
      departments
    });
  };

  // Calculate analytics data
  const calculateAnalytics = () => {
    if (students.length === 0) return;

    // Department statistics
    const departmentStats = students.reduce((acc, student) => {
      const dept = student.department || 'Unknown';
      if (!acc[dept]) {
        acc[dept] = { name: dept, count: 0, totalPoints: 0, avgPoints: 0 };
      }
      acc[dept].count++;
      acc[dept].totalPoints += student.totalPoints || 0;
      return acc;
    }, {});

    const departmentStatsArray = Object.values(departmentStats).map((dept: any) => ({
      ...dept,
      avgPoints: Math.round(dept.totalPoints / dept.count)
    }));

    // Level distribution
    const levelDistribution = students.reduce((acc, student) => {
      const level = student.level || 1;
      if (!acc[level]) {
        acc[level] = { level, count: 0 };
      }
      acc[level].count++;
      return acc;
    }, {});

    const levelDistributionArray = Object.values(levelDistribution);

    // Top performers (top 10 students by points)
    const topPerformers = students
      .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
      .slice(0, 10)
      .map(student => ({
        name: student.name,
        points: student.totalPoints || 0,
        level: student.level || 1,
        department: student.department || 'Unknown'
      }));

    // Event participation stats
    const eventParticipation = events.map(event => ({
      title: event.title,
      participants: event.participants?.length || 0,
      maxParticipants: event.maxParticipants || 'Unlimited',
      type: event.type,
      status: event.status
    }));

    // Monthly progress (simulated data for demonstration)
    const monthlyProgress = [
      { month: 'Jan', students: Math.floor(students.length * 0.8), points: Math.floor(stats.totalPointsAwarded * 0.1) },
      { month: 'Feb', students: Math.floor(students.length * 0.9), points: Math.floor(stats.totalPointsAwarded * 0.2) },
      { month: 'Mar', students: students.length, points: Math.floor(stats.totalPointsAwarded * 0.3) },
      { month: 'Apr', students: students.length, points: Math.floor(stats.totalPointsAwarded * 0.4) },
      { month: 'May', students: students.length, points: Math.floor(stats.totalPointsAwarded * 0.5) },
      { month: 'Jun', students: students.length, points: Math.floor(stats.totalPointsAwarded * 0.6) }
    ];

    setAnalytics({
      departmentStats: departmentStatsArray,
      levelDistribution: levelDistributionArray,
      eventParticipation,
      topPerformers,
      monthlyProgress
    });
  };

  useEffect(() => {
    if (isAuthenticated && user && user.role === 'admin') {
      fetchEvents();
      fetchStudents();
    }
  }, [isAuthenticated, user]);

  // Calculate stats when data changes
  useEffect(() => {
    if (students.length > 0 || events.length > 0) {
      calculateStats();
      calculateAnalytics();
    }
  }, [students, events]);

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!eventForm.title || !eventForm.description || !eventForm.type || 
        !eventForm.points || !eventForm.department || !eventForm.date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const eventData = {
        title: eventForm.title,
        description: eventForm.description,
        type: eventForm.type as 'academic' | 'sports' | 'extracurricular',
        points: parseInt(eventForm.points),
        department: eventForm.department,
        date: eventForm.date,
        maxParticipants: eventForm.maxParticipants ? parseInt(eventForm.maxParticipants) : undefined
      };

      const response = await apiService.createEvent(eventData);
      
      if (response.success) {
        toast({
          title: "Event Created!",
          description: `${eventForm.title} has been added to the system.`,
        });
        
        // Reset form
        setEventForm({
          title: "",
          description: "",
          type: "",
          points: "",
          department: "",
          date: "",
          maxParticipants: ""
        });
        
        // Refresh events list
        fetchEvents();
      }
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin dashboard.",
      });
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAwardPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!awardForm.eventId || !awardForm.userId || !awardForm.points) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setAwardingPoints(true);
    
    try {
      const response = await apiService.awardPointsForEvent(
        awardForm.eventId,
        awardForm.userId,
        parseInt(awardForm.points)
      );

      if (response.success) {
        toast({
          title: "Points Awarded!",
          description: `${response.pointsAwarded} points awarded successfully. New level: ${response.newLevel}`,
        });

        // Show new achievements if any
        if (response.newAchievements.length > 0) {
          response.newAchievements.forEach(achievement => {
            toast({
              title: "New Achievement Unlocked!",
              description: `${achievement.title}: ${achievement.description}`,
            });
          });
        }

        // Reset form
        setAwardForm({ eventId: "", userId: "", points: "" });
        
        // Refresh data
        fetchStudents();
        fetchEvents();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to award points",
        variant: "destructive"
      });
    } finally {
      setAwardingPoints(false);
    }
  };

  const departments = [
    "Civil Engineering",
    "Mechanical Engineering",
    "Information Science Engineering",
    "Computer Science Engineering",
    "Electronics and Communication Engineering",
    "Electricals and Electronics Engineering"
  ];

  // Use real events data for recent events
  const recentEvents = events.slice(0, 3).map(event => ({
    title: event.title,
    type: event.type,
    department: event.department,
    participants: event.participants?.length || 0,
    date: event.date,
    status: event.status
  }));

  const statsData = [
    {
      title: "Total Students",
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      color: "primary"
    },
    {
      title: "Active Events",
      value: stats.activeEvents.toString(),
      icon: Calendar,
      color: "gold"
    },
    {
      title: "Points Awarded",
      value: stats.totalPointsAwarded.toLocaleString(),
      icon: Award,
      color: "success"
    },
    {
      title: "Departments",
      value: stats.departments.toString(),
      icon: Briefcase,
      color: "extracurricular"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gradient-gold">
                <Shield className="w-6 h-6 text-gold-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  EduGameHub Management Panel
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Manage Events</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsData.map((stat, index) => (
                <Card key={index} className="p-6 bg-gradient-surface border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Recent Events */}
            <Card className="p-6 bg-gradient-surface border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Events
                </h3>
              </div>
              
              <div className="space-y-3">
                {recentEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30">
                    <div>
                      <p className="font-medium text-foreground">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.type} • {event.department} • {event.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{event.participants}</p>
                        <p className="text-xs text-muted-foreground">participants</p>
                      </div>
                      <Badge 
                        variant={event.status === 'completed' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card className="p-6 bg-gradient-surface border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Event
              </h3>
              
              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                      placeholder="e.g., Mid-Semester Exam"
                      className="bg-surface border-border"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Event Type</Label>
                    <Select onValueChange={(value) => setEventForm({...eventForm, type: value})}>
                      <SelectTrigger className="bg-surface border-border">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="extracurricular">Extra-Curricular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={eventForm.description}
                    onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                    placeholder="Event description and details..."
                    className="bg-surface border-border"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      value={eventForm.points}
                      onChange={(e) => setEventForm({...eventForm, points: e.target.value})}
                      placeholder="100"
                      className="bg-surface border-border"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Max Participants (Optional)</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      value={eventForm.maxParticipants}
                      onChange={(e) => setEventForm({...eventForm, maxParticipants: e.target.value})}
                      placeholder="50"
                      className="bg-surface border-border"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select onValueChange={(value) => setEventForm({...eventForm, department: value})}>
                      <SelectTrigger className="bg-surface border-border">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Departments">All Departments</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                      className="bg-surface border-border"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="bg-gradient-gold text-gold-foreground shadow-gold"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Event"}
                </Button>
              </form>
            </Card>

            {/* Award Points Section */}
            <Card className="p-6 bg-gradient-surface border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Award Points for Event Participation
              </h3>
              
              <form onSubmit={handleAwardPoints} className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="awardEvent">Event</Label>
                    <Select onValueChange={(value) => setAwardForm({...awardForm, eventId: value})}>
                      <SelectTrigger className="bg-surface border-border">
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map((event) => (
                          <SelectItem key={event._id} value={event._id}>
                            {event.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="awardStudent">Student</Label>
                    <Select onValueChange={(value) => setAwardForm({...awardForm, userId: value})}>
                      <SelectTrigger className="bg-surface border-border">
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student._id} value={student._id}>
                            {student.name} ({student.studentId})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="awardPoints">Points</Label>
                    <Input
                      id="awardPoints"
                      type="number"
                      value={awardForm.points}
                      onChange={(e) => setAwardForm({...awardForm, points: e.target.value})}
                      placeholder="e.g., 100"
                      className="bg-surface border-border"
                      required
                      min="1"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="bg-gradient-primary text-primary-foreground shadow-primary"
                  disabled={awardingPoints}
                >
                  {awardingPoints ? "Awarding..." : "Award Points"}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Student Management</h2>
                <Badge className="bg-blue/20 text-blue border-blue/30">
                  {students.length} Students
                </Badge>
              </div>
              
              {studentsLoading ? (
                <Card className="p-6 bg-gradient-surface border-border/50">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-muted-foreground">Loading students...</span>
                  </div>
                </Card>
              ) : students.length > 0 ? (
                <div className="grid gap-4">
                  {students.map((student, index) => (
                    <Card key={student._id || index} className="p-6 bg-gradient-surface border-border/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{student.name}</h3>
                            <Badge 
                              variant={student.isActive ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {student.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                              <p><strong>Student ID:</strong> {student.studentId}</p>
                              <p><strong>Email:</strong> {student.email}</p>
                              <p><strong>Department:</strong> {student.department}</p>
                            </div>
                            <div>
                              <p><strong>Year:</strong> {student.year}</p>
                              <p><strong>Total Points:</strong> {student.totalPoints || 0}</p>
                              <p><strong>Level:</strong> {student.level || 1}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-gold/20 text-gold border-gold/30">
                              Level {student.level || 1}
                            </Badge>
                          </div>
                          <p className="text-lg font-bold text-primary">{student.totalPoints || 0}</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 bg-gradient-surface border-border/50">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Students Found</h3>
                    <p className="text-muted-foreground">
                      No students are currently registered in the system.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Overview Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-surface border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Points</p>
                    <p className="text-xl font-bold text-foreground">
                      {stats.totalStudents > 0 ? Math.round(stats.totalPointsAwarded / stats.totalStudents) : 0}
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 bg-gradient-surface border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gold/10">
                    <Trophy className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Top Performer</p>
                    <p className="text-xl font-bold text-foreground">
                      {analytics.topPerformers.length > 0 ? analytics.topPerformers[0].points : 0}
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 bg-gradient-surface border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Activity className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Events</p>
                    <p className="text-xl font-bold text-foreground">{stats.activeEvents}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 bg-gradient-surface border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-extracurricular/10">
                    <Target className="w-5 h-5 text-extracurricular" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Departments</p>
                    <p className="text-xl font-bold text-foreground">{stats.departments}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Department Statistics */}
            <Card className="p-6 bg-gradient-surface border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Department Statistics
              </h3>
              <div className="space-y-3">
                {analytics.departmentStats.map((dept: any, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                    <div>
                      <p className="font-medium text-foreground">{dept.name}</p>
                      <p className="text-sm text-muted-foreground">{dept.count} students</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{dept.avgPoints}</p>
                      <p className="text-xs text-muted-foreground">avg points</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Performers */}
            <Card className="p-6 bg-gradient-surface border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Top Performers
              </h3>
              <div className="space-y-3">
                {analytics.topPerformers.slice(0, 5).map((performer: any, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-gold">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{performer.name}</p>
                        <p className="text-sm text-muted-foreground">{performer.department} • Level {performer.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gold">{performer.points}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Event Participation */}
            <Card className="p-6 bg-gradient-surface border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Event Participation
              </h3>
              <div className="space-y-3">
                {analytics.eventParticipation.slice(0, 5).map((event: any, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                    <div>
                      <p className="font-medium text-foreground">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.type} • {event.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{event.participants}</p>
                      <p className="text-xs text-muted-foreground">participants</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Level Distribution */}
            <Card className="p-6 bg-gradient-surface border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Level Distribution
              </h3>
              <div className="space-y-3">
                {analytics.levelDistribution.map((level: any, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{level.level}</span>
                      </div>
                      <p className="font-medium text-foreground">Level {level.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{level.count}</p>
                      <p className="text-xs text-muted-foreground">students</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;