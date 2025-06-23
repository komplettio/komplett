import type { FileKind, FileType } from '#types';

export const IMAGE_FILE_TYPES = ['avif', 'gif', 'jpeg', 'jpg', 'png', 'webp'] as const;
export const VIDEO_FILE_TYPES = ['mp4', 'webm', 'avi', 'mkv', 'mov'] as const;
export const AUDIO_FILE_TYPES = ['mp3', 'wav', 'flac', 'aac', 'ogg'] as const;
export const TEXT_FILE_TYPES = ['txt', 'md', 'csv', 'json'] as const;
export const DOCUMENT_FILE_TYPES = ['pdf', 'docx', 'xlsx'] as const;

export const FILE_TYPE_MAP = {
  image: IMAGE_FILE_TYPES,
  video: VIDEO_FILE_TYPES,
  audio: AUDIO_FILE_TYPES,
  text: TEXT_FILE_TYPES,
  document: DOCUMENT_FILE_TYPES,
  unknown: [] as const,
} as const satisfies Record<FileKind, readonly string[]>;

export const DEFAULT_FILE_TYPE_MAP = {
  image: 'png',
  video: 'mp4',
  audio: 'mp3',
  text: 'txt',
  document: 'pdf',
  unknown: 'txt',
} as const satisfies Record<FileKind, FileType>;
