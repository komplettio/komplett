export type FileCategory = 'image' | 'video' | 'audio' | 'text' | 'document' | 'other';

export interface BaseFileOptions {
  quality?: number;
  [key: string]: unknown;
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
}

export interface AudioFileOptions extends BaseFileOptions {
  type: 'audio';
  volume?: number;
  bitrate?: number;
  sampleRate?: number;
}

export interface TextFileOptions extends BaseFileOptions {
  type: 'text';
  encoding?: string;
  lineEnding?: 'lf' | 'crlf';
  wordWrap?: boolean;
  maxLineLength?: number;
}

export interface DocumentFileOptions extends BaseFileOptions {
  type: 'document';
  compression?: number;
  pageRange?: {
    start?: number;
    end?: number;
  };
}

export interface OtherFileOptions extends BaseFileOptions {
  type: 'other';
}

export interface BaseFileMetadata {
  size: number;
  mimeType: string;
  [key: string]: unknown;
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
