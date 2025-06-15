import { FileCategory } from '#types/file.types';

export function determineFileCategory(mimeType: string): FileCategory {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('text') || mimeType.includes('markdown')) return 'text';
  if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';
  return 'other';
}
