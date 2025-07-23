import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface NavigationTileProps {
  title: string;
  description: string;
  icon: LucideIcon;
  stats: { label: string; value: string; trend?: string }[];
  gradient: string;
  size?: "small" | "medium" | "large" | "wide";
  onClick?: () => void;
  delay?: number;
}

export function NavigationTile({
  title,
  description,
  icon: Icon,
  stats,
  gradient,
  size = "medium",
  onClick,
  delay = 0
}: NavigationTileProps) {
  return (
    <Card 
      className={cn(
        "glass border-0 overflow-hidden cursor-pointer group transition-smooth hover-lift animate-scale-in",
        size === "small" && "col-span-1 row-span-1",
        size === "medium" && "col-span-1 row-span-2", 
        size === "large" && "col-span-2 row-span-2",
        size === "wide" && "col-span-2 row-span-1"
      )}
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn("absolute inset-0 opacity-10 group-hover:opacity-20 transition-smooth", gradient)} />
      
      <CardContent className="relative p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-smooth">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className={cn(
            "p-3 rounded-2xl transition-smooth group-hover:scale-110",
            "bg-white/10 backdrop-blur-sm"
          )}>
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>

        {/* Stats */}
        <div className={cn(
          "grid gap-4 flex-1",
          size === "large" ? "grid-cols-2" : "grid-cols-1",
          size === "wide" ? "grid-cols-4" : ""
        )}>
          {stats.map((stat, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                {stat.trend && (
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full font-medium",
                    stat.trend.startsWith('+') 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  )}>
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Hover indicator */}
        <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-smooth">
          <span className="text-sm font-medium text-primary">Manage {title}</span>
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary text-sm">→</span>
          </div>
        </div>
      </CardContent>

      {/* Floating decorations */}
      <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-primary/40 float" />
      <div className="absolute bottom-6 left-6 w-1 h-1 rounded-full bg-accent/60 float-delayed" />
    </Card>
  );
}

export { NavigationTile as TileNavigation };