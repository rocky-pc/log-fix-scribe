export interface ErrorEntry {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string | null;
  tags: string[];
  solution: string | null;
  status: 'open' | 'in-progress' | 'resolved';
  created_at: string;
  updated_at: string;
  files: {
    id: string;
    filename: string;
    filepath: string;
    size: number;
    mimetype: string;
  }[];
}