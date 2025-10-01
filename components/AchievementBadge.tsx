import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LucideIcon, Star } from "lucide-react";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: LucideIcon;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt?: Date;
  isEarned: boolean;
  points: number;
}

const AchievementBadge = ({
  title,
  description,
  icon: Icon,
  rarity,
  earnedAt,
  isEarned,
  points
}: AchievementBadgeProps) => {
  const rarityColors = {
    common: "from-muted/50 to-muted/20 border-muted text-muted-foreground",
    rare: "from-primary/20 to-primary/5 border-primary/30 text-primary",
    epic: "from-gold/20 to-gold/5 border-gold/30 text-gold",
    legendary: "from-gradient-primary border-primary/50 text-primary-foreground shadow-glow"
  };

  const iconColors = {
    common: "text-muted-foreground",
    rare: "text-primary",
    epic: "text-gold",
    legendary: "text-primary-foreground"
  };

  const bgColors = {
    common: "bg-muted/10",
    rare: "bg-primary/10",
    epic: "bg-gold/10",
    legendary: "bg-primary/20"
  };

  return (
    <Card className={`relative p-4 bg-gradient-to-br ${rarityColors[rarity]} transition-all duration-300 ${
      isEarned ? 'hover:scale-105 cursor-pointer' : 'opacity-60'
    } ${rarity === 'legendary' ? 'animate-glow-pulse' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${bgColors[rarity]} flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColors[rarity]}`} />
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-sm truncate">{title}</h4>
            {rarity === 'legendary' && (
              <Star className="w-3 h-3 text-gold animate-pulse" />
            )}
          </div>
          
          <p className="text-xs opacity-80 mb-2 line-clamp-2">{description}</p>
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              {points} pts
            </Badge>
            
            {isEarned && earnedAt && (
              <span className="text-xs opacity-70">
                {earnedAt.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {!isEarned && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
          <div className="text-xs text-center px-2">
            <div className="w-8 h-8 border-2 border-muted rounded-full flex items-center justify-center mb-1 mx-auto">
              <span className="text-xs">?</span>
            </div>
            <span className="text-muted-foreground">Locked</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AchievementBadge;