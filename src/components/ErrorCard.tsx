import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ErrorEntry } from "@/types/error";
import { Calendar, FileText, Tag, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorCardProps {
  error: ErrorEntry;
  onEdit: (error: ErrorEntry) => void;
  onView: (error: ErrorEntry) => void;
}

const severityColors = {
  critical: "border-critical text-critical",
  high: "border-high text-high",
  medium: "border-medium text-medium",
  low: "border-low text-low",
} as const;

const statusIcons = {
  open: AlertTriangle,
  "in-progress": Clock,
  resolved: CheckCircle,
} as const;

export function ErrorCard({ error, onEdit, onView }: ErrorCardProps) {
  const StatusIcon = statusIcons[error.status];

  return (
    <Card className="bg-gradient-card border-border/50 hover:border-primary/20 transition-all duration-200 hover:shadow-glow">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {error.title}
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  "border-2 font-medium",
                  severityColors[error.severity]
                )}
              >
                {error.severity.toUpperCase()}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {error.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon
              className={cn(
                "h-5 w-5",
                error.status === "open" && "text-error",
                error.status === "in-progress" && "text-warning",
                error.status === "resolved" && "text-success"
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(error.created_at).toLocaleDateString()}
            </span>
          </div>
          {error.category && (
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span>{error.category}</span>
            </div>
          )}
          {error.files.length > 0 && (
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>
                {error.files.length} file{error.files.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {error.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {error.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          <Badge
            variant={error.status === "resolved" ? "default" : "secondary"}
            className="capitalize"
          >
            {error.status.replace("-", " ")}
          </Badge>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onView(error)}>
              View
            </Button>
            <Button variant="default" size="sm" onClick={() => onEdit(error)}>
              Edit
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}