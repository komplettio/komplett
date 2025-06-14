// Base types for file system
export type FileStatus = 'pending' | 'processing' | 'completed' | 'error';
export type FileCategory = 'image' | 'video' | 'audio' | 'document' | 'other';

// Discriminated union for file type-specific options
export interface BaseFileOptions {
  quality?: number;
  [key: string]: any;
}

export interface ImageFileOptions extends BaseFileOptions {
  type: 'image';
  brightness?: number;
  contrast?: number;
  saturation?: number;
  resize?: {
    width?: number;
    height?: number;
    maintainAspectRatio?: boolean;
  };
  filters?: {
    blur?: number;
    sharpen?: number;
    sepia?: boolean;
    grayscale?: boolean;
  };
}

export interface VideoFileOptions extends BaseFileOptions {
  type: 'video';
  resolution?: number;
  bitrate?: number;
  frameRate?: number;
  codec?: string;
  trim?: {
    start?: number;
    end?: number;
  };
  effects?: {
    stabilization?: boolean;
    colorCorrection?: boolean;
  };
}

export interface AudioFileOptions extends BaseFileOptions {
  type: 'audio';
  volume?: number;
  normalization?: number;
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
  effects?: {
    noiseReduction?: boolean;
    compressor?: boolean;
    equalizer?: {
      bass?: number;
      mid?: number;
      treble?: number;
    };
  };
}

export interface DocumentFileOptions extends BaseFileOptions {
  type: 'document';
  compression?: number;
  pageRange?: {
    start?: number;
    end?: number;
  };
  watermark?: {
    text?: string;
    opacity?: number;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  };
}

export interface OtherFileOptions extends BaseFileOptions {
  type: 'other';
}

// Union type for all file options
export type FileTypeOptions = 
  | ImageFileOptions 
  | VideoFileOptions 
  | AudioFileOptions 
  | DocumentFileOptions 
  | OtherFileOptions;

// File metadata interfaces
export interface BaseFileMetadata {
  size: number;
  mimeType: string;
  checksum?: string;
  [key: string]: any;
}

export interface ImageMetadata extends BaseFileMetadata {
  dimensions: {
    width: number;
    height: number;
  };
  colorSpace?: string;
  hasAlpha?: boolean;
  dpi?: number;
}

export interface VideoMetadata extends BaseFileMetadata {
  duration: number;
  dimensions: {
    width: number;
    height: number;
  };
  frameRate: number;
  bitrate?: number;
  codec?: string;
  hasAudio?: boolean;
}

export interface AudioMetadata extends BaseFileMetadata {
  duration: number;
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
  codec?: string;
}

export interface DocumentMetadata extends BaseFileMetadata {
  pageCount?: number;
  author?: string;
  title?: string;
  createdDate?: Date;
}

export type FileMetadata = ImageMetadata | VideoMetadata | AudioMetadata | DocumentMetadata | BaseFileMetadata;

// Main project file interface
export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  originalName: string;
  category: FileCategory;
  mimeType: string;
  size: number;
  blob: Blob;
  
  // Version management
  currentVersion: number;
  versions: any[]; // Simplified for now
  
  // Processing state
  status: FileStatus;
  progress?: number;
  
  // File options (type-safe)
  options: FileTypeOptions;
  
  // Metadata (type-safe)
  metadata: FileMetadata;
  
  // Export settings
  targetFormat?: string;
  exportedBlob?: Blob;
  lastExportDate?: Date;
  
  // Timestamps
  createdDate: Date;
  lastModified: Date;
  lastAccessed: Date;
  
  // Tags and organization
  tags: string[];
  description?: string;
  
  // Performance optimization
  thumbnailBlob?: Blob;
  previewGenerated: boolean;
}

// Project interface
export interface Project {
  id: string;
  name: string;
  description?: string;
  
  // File management
  files: ProjectFile[];
  fileCount: number;
  totalSize: number;
  
  // Organization
  tags: string[];
  category?: string;
  
  // Timestamps
  createdDate: Date;
  lastModified: Date;
  lastAccessed: Date;
  
  // Settings
  settings: {
    autoSave: boolean;
    compressionLevel: number;
    maxVersions: number;
    autoCleanup: boolean;
  };
  
  // Statistics
  stats: {
    totalProcessingTime: number;
    successfulExports: number;
    failedExports: number;
  };
}

// Type guards for file options
export const isImageFileOptions = (options: FileTypeOptions): options is ImageFileOptions => {
  return options.type === 'image';
};

export const isVideoFileOptions = (options: FileTypeOptions): options is VideoFileOptions => {
  return options.type === 'video';
};

export const isAudioFileOptions = (options: FileTypeOptions): options is AudioFileOptions => {
  return options.type === 'audio';
};

export const isDocumentFileOptions = (options: FileTypeOptions): options is DocumentFileOptions => {
  return options.type === 'document';
};

// Type guards for metadata
export const isImageMetadata = (metadata: FileMetadata): metadata is ImageMetadata => {
  return 'dimensions' in metadata && !('duration' in metadata);
};

export const isVideoMetadata = (metadata: FileMetadata): metadata is VideoMetadata => {
  return 'duration' in metadata && 'dimensions' in metadata && 'frameRate' in metadata;
};

export const isAudioMetadata = (metadata: FileMetadata): metadata is AudioMetadata => {
  return 'duration' in metadata && !('dimensions' in metadata);
};

export const isDocumentMetadata = (metadata: FileMetadata): metadata is DocumentMetadata => {
  return 'pageCount' in metadata;
};

// Utility types for API responses
export interface ProjectSummary {
  id: string;
  name: string;
  fileCount: number;
  totalSize: number;
  lastModified: Date;
  thumbnail?: string;
}

export interface FileOperationResult {
  success: boolean;
  fileId?: string;
  error?: string;
  warnings?: string[];
}

export interface BatchOperationResult {
  successful: FileOperationResult[];
  failed: FileOperationResult[];
  totalProcessed: number;
}

// Search and filter types
export interface FileSearchCriteria {
  query?: string;
  category?: FileCategory;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sizeRange?: {
    min: number;
    max: number;
  };
  status?: FileStatus;
}

export interface ProjectSearchCriteria {
  query?: string;
  tags?: string[];
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}