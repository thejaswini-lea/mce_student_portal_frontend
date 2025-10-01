import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgressCard from "@/components/ProgressCard";
import AchievementBadge from "@/components/AchievementBadge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  BookOpen, 
  Trophy, 
  Users, 
  Award, 
  Calendar, 
  TrendingUp,
  Star,
  Target,
  Medal,
  Zap,
  Crown,
  LogOut
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const StudentDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [leaderboard, setLeaderboard] = useState([]);
  const [events, setEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [userParticipations, setUserParticipations] = useState([]);
  const [userStats, setUserStats] = useState({
    thisMonthPoints: 0,
    streak: 0,
    totalAchievements: 0
  });
  const [loading, setLoading] = useState(false);
  const [participating, setParticipating] = useState<string | null>(null);

  // Check authentication and student role
  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Access Denied",
        description: "Please log in to access the student dashboard.",
        variant: "destructive"
      });
      navigate("/student-login");
      return;
    }

    if (user.role !== 'student') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the student dashboard.",
        variant: "destructive"
      });
      navigate("/");
      return;
    }
  }, [isAuthenticated, user, navigate, toast]);

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await apiService.getLeaderboard({ limit: 10 });
      if (response.success) {
        setLeaderboard(response.data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch events data
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEvents({ limit: 10 });
      if (response.success) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Icon mapping for achievement icons
  const iconMap: { [key: string]: any } = {
    'book-open': BookOpen,
    'trophy': Trophy,
    'crown': Crown,
    'zap': Zap,
    'star': Star,
    'award': Award,
    'medal': Medal
  };

  // Fetch user achievements
  const fetchAchievements = async () => {
    try {
      if (user?._id) {
        const response = await apiService.getUserAchievements(user._id);
        if (response.success) {
          // Map API achievements to component format
          const mappedAchievements = response.data.map((achievement: any) => ({
            title: achievement.achievementId.title,
            description: achievement.achievementId.description,
            icon: iconMap[achievement.achievementId.icon] || Star,
            rarity: achievement.achievementId.rarity,
            earnedAt: new Date(achievement.earnedAt),
            isEarned: true,
            points: achievement.points
          }));
          setAchievements(mappedAchievements);
        }
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  // Fetch user event participations
  const fetchUserParticipations = async () => {
    try {
      if (user?._id) {
        const response = await apiService.getUserProfile(user._id);
        if (response.success) {
          setUserParticipations(response.data.eventsParticipated || []);
        }
      }
    } catch (error) {
      console.error('Error fetching user participations:', error);
      toast({
        title: "Error",
        description: "Failed to load your event participations",
        variant: "destructive"
      });
    }
  };

  // Calculate user stats
  const calculateUserStats = () => {
    if (!user) return;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Calculate this month's points from actual event participations
    const thisMonthPoints = userParticipations
      .filter(participation => {
        const participationDate = new Date(participation.participatedAt);
        return participationDate.getMonth() === currentMonth && 
               participationDate.getFullYear() === currentYear;
      })
      .reduce((sum, participation) => sum + (participation.pointsEarned || 0), 0);
    
    // Calculate streak based on consecutive days with activity
    const streak = Math.min(30, Math.floor((user.totalPoints || 0) / 100));
    
    // Count earned achievements
    const totalAchievements = achievements.filter(a => a.isEarned).length;

    setUserStats({
      thisMonthPoints,
      streak,
      totalAchievements
    });
  };

  useEffect(() => {
    if (isAuthenticated && user && user.role === 'student') {
      fetchLeaderboard();
      fetchEvents();
      fetchAchievements();
      fetchUserParticipations();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    calculateUserStats();
  }, [user, achievements, userParticipations]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the student portal.",
      });
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleParticipateInEvent = async (eventId: string) => {
    setParticipating(eventId);
    
    try {
      const response = await apiService.participateInEvent(eventId);
      
      if (response.success) {
        toast({
          title: "Event Joined!",
          description: `You've successfully joined the event and earned ${response.pointsEarned} points!`,
        });
        
        // Refresh data to show updated points and achievements
        fetchUserParticipations();
        // Refresh user data to show updated points
        window.location.reload(); // Simple refresh for now
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join event",
        variant: "destructive"
      });
    } finally {
      setParticipating(null);
    }
  };

  // Calculate category points based on actual event participations
  const calculateCategoryPoints = () => {
    const categoryPoints = {
      academic: 0,
      sports: 0,
      extracurricular: 0
    };

    // Sum points from user's event participations by type
    userParticipations.forEach(participation => {
      const eventType = participation.eventId?.type;
      const points = participation.pointsEarned || 0;
      
      if (eventType === 'academic') {
        categoryPoints.academic += points;
      } else if (eventType === 'sports') {
        categoryPoints.sports += points;
      } else if (eventType === 'extracurricular') {
        categoryPoints.extracurricular += points;
      }
    });

    return categoryPoints;
  };

  const categoryPoints = calculateCategoryPoints();

  // Calculate progress data based on actual event participations
  const progressData = [
    {
      title: "Academics",
      icon: BookOpen,
      currentPoints: categoryPoints.academic,
      maxPoints: 2000,
      level: Math.floor(categoryPoints.academic / 200) + 1,
      nextLevelAt: 200 - (categoryPoints.academic % 200),
      color: "academic" as const,
      recentActivity: "Academic achievements and coursework"
    },
    {
      title: "Sports",
      icon: Trophy,
      currentPoints: categoryPoints.sports,
      maxPoints: 1500,
      level: Math.floor(categoryPoints.sports / 150) + 1,
      nextLevelAt: 150 - (categoryPoints.sports % 150),
      color: "sports" as const,
      recentActivity: "Sports and physical activities"
    },
    {
      title: "Extra-Curricular",
      icon: Users,
      currentPoints: categoryPoints.extracurricular,
      maxPoints: 1200,
      level: Math.floor(categoryPoints.extracurricular / 120) + 1,
      nextLevelAt: 120 - (categoryPoints.extracurricular % 120),
      color: "extracurricular" as const,
      recentActivity: "Clubs, events, and community activities"
    }
  ];

  // Generate default achievements if none are loaded
  const defaultAchievements = [
    {
      title: "First Steps",
      description: "Welcome to the student portal!",
      icon: BookOpen,
      rarity: "common" as const,
      earnedAt: user?.createdAt ? new Date(user.createdAt) : new Date(),
      isEarned: true,
      points: 50
    },
    {
      title: "Point Collector",
      description: "Earn your first 100 points",
      icon: Trophy,
      rarity: "common" as const,
      earnedAt: (user?.totalPoints || 0) >= 100 ? new Date() : undefined,
      isEarned: (user?.totalPoints || 0) >= 100,
      points: 100
    },
    {
      title: "Rising Star",
      description: "Reach level 5",
      icon: Star,
      rarity: "rare" as const,
      earnedAt: (user?.level || 1) >= 5 ? new Date() : undefined,
      isEarned: (user?.level || 1) >= 5,
      points: 200
    },
    {
      title: "Achievement Hunter",
      description: "Earn 500 total points",
      icon: Crown,
      rarity: "epic" as const,
      earnedAt: (user?.totalPoints || 0) >= 500 ? new Date() : undefined,
      isEarned: (user?.totalPoints || 0) >= 500,
      points: 500
    }
  ];

  const displayAchievements = achievements.length > 0 ? achievements : defaultAchievements;

  // Use user's actual event participations for recent activity
  const recentEvents = userParticipations.length > 0 ? userParticipations.slice(0, 3).map(participation => ({
    title: participation.eventId?.title || "Unknown Event",
    type: participation.eventId?.type || "general",
    date: participation.participatedAt,
    points: participation.pointsEarned,
    status: "completed"
  })) : [
    {
      title: "No recent activity",
      type: "General",
      date: new Date().toISOString().split('T')[0],
      points: 0,
      status: "upcoming"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{user?.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {user?.studentId} • {user?.department}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gold/20 text-gold border-gold/30">
                    Level {user?.level || 1}
                  </Badge>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {user?.totalPoints || 0} pts
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {user?.year} • {user?.department}
                </p>
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
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Progress Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {progressData.map((progress, index) => (
                <ProgressCard key={index} {...progress} />
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-surface border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-xl font-bold text-foreground">+{userStats.thisMonthPoints} pts</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 bg-gradient-surface border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gold/10">
                    <Medal className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Achievements</p>
                    <p className="text-xl font-bold text-foreground">
                      {userStats.totalAchievements}/{displayAchievements.length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-surface border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Events</p>
                    <p className="text-xl font-bold text-foreground">{events.length} Available</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-surface border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-extracurricular/10">
                    <Star className="w-5 h-5 text-extracurricular" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Streak</p>
                    <p className="text-xl font-bold text-foreground">{userStats.streak} days</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Events */}
            <Card className="p-6 bg-gradient-surface border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                    <div>
                      <p className="font-medium text-foreground">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.type} • {event.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={event.status === 'completed' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {event.status === 'completed' ? `+${event.points} pts` : 'Upcoming'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Achievement Gallery</h2>
              <Badge className="bg-gold/20 text-gold border-gold/30">
                {userStats.totalAchievements} Unlocked
              </Badge>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayAchievements.map((achievement, index) => (
                <AchievementBadge key={index} {...achievement} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Leaderboard</h2>
                <Badge className="bg-gold/20 text-gold border-gold/30">
                  Top {leaderboard.length} Students
                </Badge>
              </div>
              
              {loading ? (
                <Card className="p-6 bg-gradient-surface border-border/50">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-muted-foreground">Loading leaderboard...</span>
                  </div>
                </Card>
              ) : leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.map((student, index) => (
                    <Card key={student._id || index} className="p-4 bg-gradient-surface border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{student.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {student.studentId} • {student.department} • Level {student.level}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">{student.totalPoints}</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 bg-gradient-surface border-border/50">
                  <div className="text-center">
                    <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Data Available</h3>
                    <p className="text-muted-foreground">
                      Leaderboard data will appear here once students start earning points.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Events</h2>
                <Badge className="bg-blue/20 text-blue border-blue/30">
                  {events.length} Events
                </Badge>
              </div>
              
              {loading ? (
                <Card className="p-6 bg-gradient-surface border-border/50">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-muted-foreground">Loading events...</span>
                  </div>
                </Card>
              ) : events.length > 0 ? (
                <div className="grid gap-4">
                  {events.map((event, index) => (
                    <Card key={event._id || index} className="p-6 bg-gradient-surface border-border/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                            <Badge 
                              variant={event.type === 'academic' ? 'default' : event.type === 'sports' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {event.type}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{event.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {event.department}
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              {event.points} points
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={event.status === 'upcoming' ? 'outline' : event.status === 'ongoing' ? 'default' : 'secondary'}
                            className="mb-2"
                          >
                            {event.status}
                          </Badge>
                          {event.maxParticipants && (
                            <p className="text-xs text-muted-foreground mb-2">
                              Max: {event.maxParticipants}
                            </p>
                          )}
                          
                          {/* Check if user is already participating */}
                          {userParticipations.some(participation => 
                            participation.eventId?._id === event._id
                          ) ? (
                            <Badge className="bg-success/20 text-success border-success/30">
                              Participated
                            </Badge>
                          ) : event.status === 'upcoming' ? (
                            <Button
                              size="sm"
                              onClick={() => handleParticipateInEvent(event._id)}
                              disabled={participating === event._id}
                              className="bg-gradient-primary text-primary-foreground shadow-primary"
                            >
                              {participating === event._id ? "Joining..." : "Join Event"}
                            </Button>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              Event Ended
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 bg-gradient-surface border-border/50">
                  <div className="text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Events Available</h3>
                    <p className="text-muted-foreground">
                      Events will appear here once they are created by administrators.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;