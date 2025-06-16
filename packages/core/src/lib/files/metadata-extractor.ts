import {
  AudioMetadata,
  BaseFileMetadata,
  DocumentMetadata,
  FileKind,
  FileMetadata,
  ImageMetadata,
  VideoMetadata,
} from '#types';

/**
 * Service for extracting metadata from different file types
 */
export class MetadataExtractor {
  /**
   * Extract metadata based on file kind
   */
  async extractMetadata(file: File, kind: FileKind): Promise<FileMetadata> {
    const baseMetadata: BaseFileMetadata = {
      size: file.size,
      mimeType: file.type,
    };

    try {
      switch (kind) {
        case 'image':
          return await this.extractImageMetadata(file, baseMetadata);
        case 'video':
          return await this.extractVideoMetadata(file, baseMetadata);
        case 'audio':
          return await this.extractAudioMetadata(file, baseMetadata);
        case 'document':
          return await this.extractDocumentMetadata(file, baseMetadata);
        default:
          return baseMetadata;
      }
    } catch (error) {
      console.warn('Failed to extract metadata:', error);
      return baseMetadata;
    }
  }

  /**
   * Extract image-specific metadata
   */
  private async extractImageMetadata(file: File, base: BaseFileMetadata): Promise<ImageMetadata> {
    return new Promise(resolve => {
      // TODO: replace with a robust solution that's not dependent on browser support
      const img = new Image();
      img.onload = () => {
        resolve({
          ...base,
          dimensions: {
            width: img.width,
            height: img.height,
          },
          colorSpace: 'sRGB', // Default assumption
          hasAlpha: file.type === 'image/png' || file.type === 'image/gif',
        });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        resolve(base as ImageMetadata);
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Extract video-specific metadata
   */
  private async extractVideoMetadata(file: File, base: BaseFileMetadata): Promise<VideoMetadata> {
    return new Promise(resolve => {
      // TODO: replace with a robust solution that's not dependent on browser support
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        resolve({
          ...base,
          duration: video.duration,
          dimensions: {
            width: video.videoWidth,
            height: video.videoHeight,
          },
          frameRate: 30, // Default assumption
          hasAudio: true, // Default assumption
        });
        URL.revokeObjectURL(video.src);
      };
      video.onerror = () => {
        resolve(base as VideoMetadata);
        URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(file);
    });
  }

  /**
   * Extract audio-specific metadata
   */
  private async extractAudioMetadata(file: File, base: BaseFileMetadata): Promise<AudioMetadata> {
    return new Promise(resolve => {
      // TODO: replace with a robust solution that's not dependent on browser support
      const audio = document.createElement('audio');
      audio.onloadedmetadata = () => {
        resolve({
          ...base,
          duration: audio.duration,
          bitrate: Math.round((file.size * 8) / audio.duration / 1000),
          sampleRate: 44100, // Default assumption
          channels: 2, // Default assumption
        });
        URL.revokeObjectURL(audio.src);
      };
      audio.onerror = () => {
        resolve(base as AudioMetadata);
        URL.revokeObjectURL(audio.src);
      };
      audio.src = URL.createObjectURL(file);
    });
  }

  /**
   * Extract document-specific metadata
   */
  private extractDocumentMetadata(file: File, base: BaseFileMetadata): Promise<DocumentMetadata> {
    // For now, return basic metadata
    // In a real implementation, you'd use a PDF parsing library
    return Promise.resolve({
      ...base,
      pageCount: 1, // Default assumption
      title: file.name.replace(/\.[^/.]+$/, ''),
    });
  }
}
