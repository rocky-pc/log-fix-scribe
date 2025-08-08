export interface ErrorEntry {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  tags: string[];
  solution: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
  files: {
    id: string;
    filename: string;
    filepath: string;
    size: number;
    mimetype: string;
  }[];
}

export interface ErrorEntryFile {
  id: string;
  filename: string;
  filepath: string;
  size: number;
  mimetype: string;
}[];