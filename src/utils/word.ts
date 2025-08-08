import { ErrorEntry } from "@/types/error";

type Toast = { title: string; description?: string; variant?: string };

export const exportToWord = async (toast: ({ title, description, variant }: Toast) => void) => {
  try {
    // Fetch Word document from backend
    const response = await fetch('http://localhost:8000/api/export/word', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const { filename, content, mimetype } = data;

    // Convert base64 to binary
    const byteCharacters = atob(content);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create Blob and trigger download
    const blob = new Blob([byteArray], { type: mimetype });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Error log exported to Word successfully.",
    });
  } catch (error: any) {
    toast({
      title: "Error",
      description: `Failed to export to Word: ${error.message}`,
      variant: "destructive",
    });
  }
};