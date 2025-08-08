import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorEntry } from "@/types/error";
import { FileText, Image, File, ArrowLeft, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ErrorDetailsProps {
  error: ErrorEntry;
  onEdit: () => void;
  onClose: () => void;
}

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return Image;
  if (type.includes("text") || type.includes("json")) return FileText;
  return File;
};

export function ErrorDetails({ error, onEdit, onClose }: ErrorDetailsProps) {
  const { toast } = useToast();
  const [imageUrls, setImageUrls] = useState<{ [fileId: string]: string }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch image content for image files
  useEffect(() => {
    const fetchImages = async () => {
      const imageFiles = error.files.filter((file) => file.mimetype.startsWith("image/"));
      const urls: { [fileId: string]: string } = {};

      for (const file of imageFiles) {
        try {
          const response = await fetch(`http://localhost:8000/api/files/${file.id}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          urls[file.id] = `data:${data.mimetype};base64,${data.content}`;
        } catch (error: any) {
          toast({
            title: "Error",
            description: `Failed to load image ${file.filename}: ${error.message}`,
            variant: "destructive",
          });
        }
      }

      setImageUrls(urls);
    };

    if (error.files.some((file) => file.mimetype.startsWith("image/"))) {
      fetchImages();
    }
  }, [error.files, toast]);

  const handleDownload = async (fileId: string, filename: string, mimetype: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/files/${fileId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const binaryString = atob(data.content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mimetype });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Success",
        description: `File ${filename} downloaded successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to download file: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-card border-border/50 p-6">
          <div className="flex justify-between items-center mb-6">
            <Button variant="ghost" onClick={onClose} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </Button>
            <Button onClick={onEdit} className="bg-gradient-primary">
              Edit Error
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{error.title}</h1>
          <p className="text-muted-foreground mb-6">
            Detailed information about the error and its associated files.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Description</h3>
              <p className="text-muted-foreground">{error.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Severity</h3>
                <p className="text-muted-foreground">{error.severity}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Status</h3>
                <p className="text-muted-foreground">{error.status}</p>
              </div>
            </div>
            {error.category && (
              <div>
                <h3 className="text-lg font-semibold text-foreground">Category</h3>
                <p className="text-muted-foreground">{error.category}</p>
              </div>
            )}
            {error.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {error.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {error.solution && (
              <div>
                <h3 className="text-lg font-semibold text-foreground">Solution</h3>
                <p className="text-muted-foreground">{error.solution}</p>
              </div>
            )}
            {error.files.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground">Attachments</h3>
                <div className="space-y-2">
                  {error.files.map((file, index) => {
                    const Icon = getFileIcon(file.mimetype);
                    const isImage = file.mimetype.startsWith("image/");
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-start gap-3 p-2 bg-secondary rounded-md"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm flex-1 truncate">{file.filename}</span>
                          <span className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                          {!isImage && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(file.id, file.filename, file.mimetype)}
                            >
                              Download
                            </Button>
                          )}
                        </div>
                        {isImage && imageUrls[file.id] && (
                          <img
                            src={imageUrls[file.id]}
                            alt={file.filename}
                            className="max-w-full h-auto rounded-md mt-2 cursor-pointer"
                            style={{ maxWidth: "300px" }}
                            onClick={() => openImageModal(imageUrls[file.id])}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Created At</h3>
                <p className="text-muted-foreground">{new Date(error.created_at).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Updated At</h3>
                <p className="text-muted-foreground">{new Date(error.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative bg-gradient-card border-border/50 rounded-lg p-4 max-w-4xl w-full max-h-[80vh]">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-foreground hover:text-destructive"
              onClick={closeImageModal}
            >
              <X className="h-5 w-5" />
            </Button>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="w-full h-auto max-h-[70vh] rounded-md object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}