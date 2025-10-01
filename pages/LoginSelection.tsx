import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { GraduationCap, Shield, Trophy, Users } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const LoginSelection = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-gold/5" />
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-gradient-primary shadow-glow">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
              MCE Student Portal
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your gateway to gamified learning. Track progress, earn achievements, and compete with peers across all MCE branches.
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Student Login */}
          <Card className="p-8 bg-gradient-surface border-border/50 hover:border-primary/50 transition-all duration-300 group">
            <div className="text-center space-y-6">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto group-hover:bg-primary/20 transition-colors">
                <Users className="w-12 h-12 text-primary" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Student Portal</h3>
                <p className="text-muted-foreground mb-6">
                  Track your academic progress, earn achievements, and climb the leaderboards
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <span className="px-3 py-1 bg-academic/20 text-academic text-sm rounded-full">Academics</span>
                <span className="px-3 py-1 bg-sports/20 text-sports text-sm rounded-full">Sports</span>
                <span className="px-3 py-1 bg-extracurricular/20 text-extracurricular text-sm rounded-full">Activities</span>
              </div>

              <div className="space-y-3">
                <Link to="/student-login" className="block">
                  <Button className="w-full bg-gradient-primary hover:bg-primary/90 text-primary-foreground shadow-glow hover:shadow-[0_0_50px_hsl(var(--primary)/0.4)] transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
                <Link to="/student-register" className="block">
                  <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Admin Login */}
          <Card className="p-8 bg-gradient-surface border-border/50 hover:border-gold/50 transition-all duration-300 group">
            <div className="text-center space-y-6">
              <div className="p-4 rounded-full bg-gold/10 w-fit mx-auto group-hover:bg-gold/20 transition-colors">
                <Shield className="w-12 h-12 text-gold" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Admin Portal</h3>
                <p className="text-muted-foreground mb-6">
                  Manage events, award points, and oversee student progress across departments
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <span className="px-3 py-1 bg-gold/20 text-gold text-sm rounded-full">Event Management</span>
                <span className="px-3 py-1 bg-success/20 text-success text-sm rounded-full">Point Awards</span>
              </div>

              <Link to="/admin-login" className="block">
                <Button className="w-full bg-gradient-gold hover:bg-gold/90 text-gold-foreground shadow-gold hover:shadow-[0_0_50px_hsl(var(--gold)/0.4)] transition-all duration-300">
                  Continue as Admin
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Footer Stats */}
        <div className="mt-12 text-center">
          <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-gold" />
              <span>500+ Achievements</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>10K+ Students</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-success" />
              <span>15 Departments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSelection;