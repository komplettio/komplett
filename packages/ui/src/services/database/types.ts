// Shared database types and interfaces
import type { 
  Project, 
  ProjectFile, 
  FileCategory, 
  FileTypeOptions,
  FileMetadata,
  ImageMetadata,
  VideoMetadata,
  AudioMetadata,
  DocumentMetadata,
  BaseFileMetadata
} from '../../types/project';

// Re-export types for convenience
export type {
  Project,
  ProjectFile,
  FileCategory,
  FileTypeOptions,
  FileMetadata,
  ImageMetadata,
  VideoMetadata,
  AudioMetadata,
  DocumentMetadata,
  BaseFileMetadata
};

// Database-specific interfaces
export interface DatabaseSchema {
  projects: Project;
  files: ProjectFile;
}

export interface StorageStats {
  projectCount: number;
  fileCount: number;
  totalSize: number;
}

// Common database operations interface
export interface BaseRepository<T> {
  create(data: Omit<T, 'id'>): Promise<string>;
  get(id: string): Promise<T | undefined>;
  getAll(): Promise<T[]>;
  update(id: string, updates: Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
}