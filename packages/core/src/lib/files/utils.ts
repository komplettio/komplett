import { FileKind } from '#types/file.types';

export function determineFileKind(mimeType: string): FileKind {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('text') || mimeType.includes('markdown')) return 'text';
  if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';
  return 'unknown';
}
