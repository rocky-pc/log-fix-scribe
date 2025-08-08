import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorCard } from "@/components/ErrorCard";
import { ErrorForm } from "@/components/ErrorForm";
import { ErrorDetails } from "@/components/ErrorDetails";
import { ErrorEntry } from "@/types/error";
import { exportToWord } from "@/utils/word";
import { Plus, Search, Download, Bug } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define Toast input type for toast function arguments
interface Toast {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

// Define ToasterToast type for update function (based on Shadcn/UI)
interface ToasterToast {
  id?: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  [key: string]: any; // Allow additional properties
}

// Define ToastAction type for toast function return value
interface ToastAction {
  id: string;
  dismiss: () => void;
  update: (props: ToasterToast) => void;
}

const Index = () => {
  const { toast } = useToast() as { toast: (props: Toast) => ToastAction };
  const [errors, setErrors] = useState<ErrorEntry[]>([]);
  const [view, setView] = useState<"list" | "form" | "details">("list");
  const [editingError, setEditingError] = useState<ErrorEntry | null>(null);
  const [selectedError, setSelectedError] = useState<ErrorEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch errors from backend on component mount
  useEffect(() => {
    const fetchErrors = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/errors");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setErrors(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch errors from server.",
          variant: "destructive",
        });
      }
    };
    fetchErrors();
  }, [toast]);

  const handleSaveError = async (
    errorData: Omit<ErrorEntry, "id" | "created_at" | "updated_at" | "files">,
    files: File[]
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", errorData.title);
      formData.append("description", errorData.description);
      formData.append("severity", errorData.severity);
      formData.append("category", errorData.category || "");
      formData.append("tags", JSON.stringify(errorData.tags));
      formData.append("solution", errorData.solution || "");
      formData.append("status", errorData.status);
      files.forEach((file) => formData.append("files", file));

      const url = editingError
        ? `http://localhost:8000/api/errors/${editingError.id}`
        : "http://localhost:8000/api/errors";
      const method = editingError ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedError = await response.json();
      setErrors((prev) =>
        editingError
          ? prev.map((error) => (error.id === editingError.id ? updatedError : error))
          : [updatedError, ...prev]
      );

      toast({
        title: editingError ? "Error Updated" : "Error Added",
        description: editingError
          ? "The error entry has been updated successfully."
          : "A new error entry has been created successfully.",
        variant: "default",
      });

      setView("list");
      setEditingError(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to save error: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  if (view === "form") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {editingError ? "Edit Error Entry" : "Add New Error Entry"}
            </h1>
            <p className="text-muted-foreground">
              Document and track software errors with detailed information and solutions.
            </p>
          </div>
          <ErrorForm
            error={editingError}
            onSave={handleSaveError}
            onCancel={() => {
              setView("list");
              setEditingError(null);
            }}
          />
        </div>
      </div>
    );
  }

  if (view === "details" && selectedError) {
    return (
      <div className="min-h-screen bg-background p-6">
        <ErrorDetails
          error={selectedError}
          onEdit={() => {
            setEditingError(selectedError);
            setView("form");
          }}
          onClose={() => setView("list")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-primary p-3 rounded-lg">
                <Bug className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Error Log System</h1>
                <p className="text-muted-foreground text-lg">
                  Track, manage, and resolve software errors efficiently
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => exportToWord(toast)}
                variant="outline"
                className="gap-2"
                disabled={errors.length === 0}
              >
                <Download className="h-4 w-4" />
                Export to Word
              </Button>
              <Button
                onClick={() => setView("form")}
                className="bg-gradient-primary gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Error
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
<div className="mx-auto px-6 py-6" style={{ maxWidth: "1600px" }}>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search errors by title, description, category, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        {errors.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-card border border-border/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-foreground">{errors.length}</div>
              <div className="text-sm text-muted-foreground">Total Errors</div>
            </div>
            <div className="bg-gradient-card border border-border/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-critical">
                {errors.filter((e) => e.severity === "critical").length}
              </div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
            <div className="bg-gradient-card border border-border/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-warning">
                {errors.filter((e) => e.status === "in-progress").length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="bg-gradient-card border border-border/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-success">
                {errors.filter((e) => e.status === "resolved").length}
              </div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </div>
          </div>
        )}

        {/* Error List */}
        {errors.filter(
          (error) =>
            (severityFilter === "all" || error.severity === severityFilter) &&
            (statusFilter === "all" || error.status === statusFilter) &&
            (searchTerm === "" ||
              error.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              error.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (error.category &&
                error.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
              error.tags.some((tag) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase())
              ))
        ).length === 0 ? (
          <div className="text-center py-12">
            <Bug className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {errors.length === 0 ? "No errors logged yet" : "No errors match your filters"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {errors.length === 0
                ? "Start by adding your first error entry to begin tracking and resolving issues."
                : "Try adjusting your search terms or filters to find what you're looking for."}
            </p>
            {errors.length === 0 && (
              <Button
                onClick={() => setView("form")}
                className="bg-gradient-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Error
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {errors
              .filter(
                (error) =>
                  (severityFilter === "all" || error.severity === severityFilter) &&
                  (statusFilter === "all" || error.status === statusFilter) &&
                  (searchTerm === "" ||
                    error.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    error.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (error.category &&
                      error.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    error.tags.some((tag) =>
                      tag.toLowerCase().includes(searchTerm.toLowerCase())
                    ))
              )
              .map((error) => (
                <ErrorCard
                  key={error.id}
                  error={error}
                  onEdit={() => {
                    setEditingError(error);
                    setView("form");
                  }}
                  onView={() => {
                    setSelectedError(error);
                    setView("details");
                  }}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;