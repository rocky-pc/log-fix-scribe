import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorEntry } from "@/types/error";
import { Upload, X, FileText, Image, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface ErrorFormProps {
  error?: ErrorEntry;
  onSave: (error: Omit<ErrorEntry, 'id' | 'created_at' | 'updated_at' | 'files'>, files: File[]) => void;
  onCancel: () => void;
}

const API_BASE_URL = "http://localhost:8768";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 4;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];

export function ErrorForm({ error, onSave, onCancel }: ErrorFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: error?.title || "",
    description: error?.description || "",
    severity: error?.severity || "medium",
    category: error?.category || "",
    tags: error?.tags || [],
    solution: error?.solution || "",
    status: error?.status || "open",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isValidError, setIsValidError] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error?.id) {
      const validateErrorId = async () => {
        try {
          await axios.get(`${API_BASE_URL}/api/errors/${error.id}`);
          setIsValidError(true);
        } catch (err: any) {
          setIsValidError(false);
          toast({
            title: "Error",
            description: "The error record does not exist. Please create a new error.",
            variant: "destructive",
          });
        }
      };
      validateErrorId();
    } else {
      setIsValidError(true);
    }
  }, [error, toast]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    const currentImageCount = (error?.files?.filter((file) => ALLOWED_FILE_TYPES.includes(file.mimetype || "application/octet-stream")).length || 0) + files.filter((file) => ALLOWED_FILE_TYPES.includes(file.type)).length;
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    uploadedFiles.forEach((file) => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        invalidFiles.push(`${file.name} (only JPEG, PNG, or GIF images are allowed)`);
      } else if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} (file size exceeds 5MB)`);
      } else if (currentImageCount + validFiles.length >= MAX_IMAGES) {
        invalidFiles.push(`${file.name} (maximum 4 images allowed)`);
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
      toast({
        title: "Images uploaded",
        description: `${validFiles.length} image(s) added successfully.`,
      });
    }

    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid Files",
        description: `The following files were not added: ${invalidFiles.join(", ")}`,
        variant: "destructive",
      });
    }

    if (uploadedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one image to upload.",
        variant: "destructive",
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    toast({
      title: "Image removed",
      description: "The image has been removed from the upload list.",
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (error && !isValidError) {
      toast({
        title: "Error",
        description: "Cannot update error: Record does not exist.",
        variant: "destructive",
      });
      return;
    }

    try {
      onSave(
        {
          title: formData.title,
          description: formData.description,
          severity: formData.severity,
          category: formData.category,
          tags: formData.tags,
          solution: formData.solution,
          status: formData.status,
        },
        files
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save error. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type.includes("text") || type.includes("json")) return FileText;
    return File;
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (isValidError === false) {
    return (
      <Card className="bg-gradient-card border-border/50 p-6">
        <div className="text-center">
          <p className="text-lg font-medium text-destructive">
            Error record not found. Please create a new error or select a different one.
          </p>
          <Button className="mt-4" onClick={onCancel}>
            Back
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-border/50">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Error Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Brief description of the error"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              placeholder="e.g., Frontend, Backend, Database"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Error Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Detailed description of the error, steps to reproduce, etc."
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Severity</Label>
            <Select
              value={formData.severity}
              onValueChange={(value: any) => setFormData((prev) => ({ ...prev, severity: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="Add tags (press Enter)"
              className="flex-1"
            />
            <Button type="button" onClick={addTag} variant="outline">
              Add
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Image Attachments (Up to 4)</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/20 transition-colors">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Upload up to 4 images (JPEG, PNG, GIF; max 5MB each)
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept={ALLOWED_FILE_TYPES.join(",")}
                ref={fileInputRef}
              />
              <Button type="button" variant="outline" size="sm" onClick={triggerFileInput}>
                Choose Images
              </Button>
            </div>
          </div>
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">New Image Attachments</p>
              {files.map((file, index) => {
                const Icon = getFileIcon(file.type);
                return (
                  <div key={index} className="flex items-center gap-3 p-2 bg-secondary rounded-md">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
          {error?.files?.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Existing Image Attachments</p>
              {error.files.map((file, index) => {
                const Icon = getFileIcon(file.mimetype || "application/octet-stream");
                return (
                  <div key={index} className="flex items-center gap-3 p-2 bg-secondary rounded-md">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm flex-1 truncate">{file.filename}</span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="solution">Solution</Label>
          <Textarea
            id="solution"
            value={formData.solution}
            onChange={(e) => setFormData((prev) => ({ ...prev, solution: e.target.value }))}
            placeholder="Describe the solution or workaround for this error"
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-gradient-primary">
            {error?.id ? "Update Error" : "Save Error"}
          </Button>
        </div>
      </form>
    </Card>
  );
}