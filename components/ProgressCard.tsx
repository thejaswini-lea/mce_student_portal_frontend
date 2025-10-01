import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface ProgressCardProps {
  title: string;
  icon: LucideIcon;
  currentPoints: number;
  maxPoints: number;
  level: number;
  nextLevelAt: number;
  color: "academic" | "sports" | "extracurricular";
  recentActivity?: string;
}

const ProgressCard = ({
  title,
  icon: Icon,
  currentPoints,
  maxPoints,
  level,
  nextLevelAt,
  color,
  recentActivity
}: ProgressCardProps) => {
  const progressPercentage = (currentPoints / maxPoints) * 100;
  const levelProgress = ((currentPoints % nextLevelAt) / nextLevelAt) * 100;

  const colorClasses = {
    academic: "from-academic/20 to-academic/5 border-academic/20",
    sports: "from-sports/20 to-sports/5 border-sports/20",
    extracurricular: "from-extracurricular/20 to-extracurricular/5 border-extracurricular/20"
  };

  const iconColorClasses = {
    academic: "text-academic bg-academic/10",
    sports: "text-sports bg-sports/10",
    extracurricular: "text-extracurricular bg-extracurricular/10"
  };

  const badgeColorClasses = {
    academic: "bg-academic/20 text-academic border-academic/30",
    sports: "bg-sports/20 text-sports border-sports/30",
    extracurricular: "bg-extracurricular/20 text-extracurricular border-extracurricular/30"
  };

  return (
    <Card className={`p-6 bg-gradient-to-br ${colorClasses[color]} border hover:shadow-elevated transition-all duration-300 group`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconColorClasses[color]} group-hover:scale-110 transition-transform`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">Level {level}</p>
          </div>
        </div>
        <Badge className={`${badgeColorClasses[color]} hover:scale-105 transition-transform`}>
          {currentPoints} pts
        </Badge>
      </div>

      <div className="space-y-3">
        {/* Overall Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Total Progress</span>
            <span className="text-foreground font-medium">{currentPoints}/{maxPoints}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Level Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Next Level</span>
            <span className="text-foreground font-medium">{levelProgress.toFixed(0)}%</span>
          </div>
          <Progress value={levelProgress} className="h-2" />
        </div>

        {recentActivity && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              <span className="text-success">Recent:</span> {recentActivity}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProgressCard;