import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, logout, error, clearError } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();
    
    try {
      console.log('Attempting login with:', { email, password: '***' });
      const loginResponse = await login(email, password);
      
      // Check if the logged-in user is an admin using the response data
      console.log('Login response:', loginResponse);
      
      if (!loginResponse.user || loginResponse.user.role !== 'admin') {
        // Logout the user
        await logout();
        toast({
          title: "Access Denied",
          description: "Students cannot access the admin dashboard. Please use the student login.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Admin access granted!",
        description: "Successfully logged in to admin dashboard.",
      });
      navigate("/admin-dashboard");
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-background to-primary/5" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to selection
        </Link>

        <Card className="p-8 bg-gradient-surface border-border/50 shadow-elevated">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="p-3 rounded-full bg-gold/10 w-fit mx-auto mb-4">
              <Shield className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Admin Login</h1>
            <p className="text-muted-foreground">Access administrative controls</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-surface border-border focus:border-gold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-surface border-border focus:border-gold"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-gold hover:bg-gold/90 text-gold-foreground shadow-gold"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Access Dashboard"}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-sm">
              <p><strong>Email:</strong> admin@mce.edu</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need admin access?{" "}
              <a href="#" className="text-gold hover:underline">
                Contact IT Support
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;