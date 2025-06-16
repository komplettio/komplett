export type FileKind = 'image' | 'video' | 'audio' | 'text' | 'document' | 'unknown';

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
