import { 
  FileTypeOptions, 
  ImageFileOptions, 
  VideoFileOptions, 
  AudioFileOptions, 
  DocumentFileOptions,
  isImageFileOptions,
  isVideoFileOptions,
  isAudioFileOptions,
  isDocumentFileOptions
} from '../types/project';

// Abstract base class for file type handlers
export abstract class FileTypeHandler<T extends FileTypeOptions> {
  abstract readonly supportedMimeTypes: string[];
  abstract readonly supportedExportFormats: string[];
  
  abstract validateOptions(options: T): boolean;
  abstract getDefaultOptions(): T;
  abstract processFile(file: Blob, options: T, onProgress?: (progress: number) => void): Promise<Blob>;
  abstract generateThumbnail(file: Blob): Promise<Blob>;
  
  canHandle(mimeType: string): boolean {
    return this.supportedMimeTypes.some(type => 
      mimeType.startsWith(type) || mimeType === type
    );
  }
}

// Image file handler
export class ImageFileHandler extends FileTypeHandler<ImageFileOptions> {
  readonly supportedMimeTypes = ['image/'];
  readonly supportedExportFormats = ['jpg', 'png', 'webp', 'gif', 'bmp', 'tiff'];
  
  validateOptions(options: ImageFileOptions): boolean {
    return (
      options.type === 'image' &&
      (options.brightness === undefined || (options.brightness >= 0 && options.brightness <= 200)) &&
      (options.contrast === undefined || (options.contrast >= 0 && options.contrast <= 200)) &&
      (options.saturation === undefined || (options.saturation >= 0 && options.saturation <= 200)) &&
      (options.quality === undefined || (options.quality >= 1 && options.quality <= 100))
    );
  }
  
  getDefaultOptions(): ImageFileOptions {
    return {
      type: 'image',
      brightness: 100,
      contrast: 100,
      saturation: 100,
      quality: 90
    };
  }
  
  async processFile(
    file: Blob, 
    options: ImageFileOptions, 
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          onProgress?.(25);
          
          // Set canvas dimensions
          let { width, height } = img;
          
          if (options.resize) {
            if (options.resize.width && options.resize.height) {
              width = options.resize.width;
              height = options.resize.height;
            } else if (options.resize.width) {
              const ratio = options.resize.width / img.width;
              width = options.resize.width;
              height = options.resize.maintainAspectRatio ? img.height * ratio : img.height;
            } else if (options.resize.height) {
              const ratio = options.resize.height / img.height;
              height = options.resize.height;
              width = options.resize.maintainAspectRatio ? img.width * ratio : img.width;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          onProgress?.(50);
          
          // Apply filters
          if (ctx) {
            let filterString = '';
            
            if (options.brightness !== undefined && options.brightness !== 100) {
              filterString += `brightness(${options.brightness}%) `;
            }
            
            if (options.contrast !== undefined && options.contrast !== 100) {
              filterString += `contrast(${options.contrast}%) `;
            }
            
            if (options.saturation !== undefined && options.saturation !== 100) {
              filterString += `saturate(${options.saturation}%) `;
            }
            
            if (options.filters?.blur) {
              filterString += `blur(${options.filters.blur}px) `;
            }
            
            if (options.filters?.sepia) {
              filterString += 'sepia(100%) ';
            }
            
            if (options.filters?.grayscale) {
              filterString += 'grayscale(100%) ';
            }
            
            ctx.filter = filterString.trim();
            ctx.drawImage(img, 0, 0, width, height);
          }
          
          onProgress?.(75);
          
          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                onProgress?.(100);
                resolve(blob);
              } else {
                reject(new Error('Failed to convert canvas to blob'));
              }
            },
            `image/${this.getOutputFormat(options)}`,
            options.quality ? options.quality / 100 : 0.9
          );
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
  
  async generateThumbnail(file: Blob): Promise<Blob> {
    const thumbnailOptions: ImageFileOptions = {
      type: 'image',
      quality: 70,
      resize: {
        width: 200,
        height: 200,
        maintainAspectRatio: true
      }
    };
    
    return this.processFile(file, thumbnailOptions);
  }
  
  private getOutputFormat(options: ImageFileOptions): string {
    // Default to original format or jpeg
    return 'jpeg';
  }
}

// Video file handler
export class VideoFileHandler extends FileTypeHandler<VideoFileOptions> {
  readonly supportedMimeTypes = ['video/'];
  readonly supportedExportFormats = ['mp4', 'webm', 'avi', 'mov', 'mkv'];
  
  validateOptions(options: VideoFileOptions): boolean {
    return (
      options.type === 'video' &&
      (options.quality === undefined || (options.quality >= 1 && options.quality <= 100)) &&
      (options.resolution === undefined || (options.resolution >= 25 && options.resolution <= 200)) &&
      (options.bitrate === undefined || (options.bitrate >= 500 && options.bitrate <= 50000))
    );
  }
  
  getDefaultOptions(): VideoFileOptions {
    return {
      type: 'video',
      quality: 80,
      resolution: 100,
      bitrate: 5000,
      frameRate: 30
    };
  }
  
  async processFile(
    file: Blob, 
    options: VideoFileOptions, 
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    // Simulate video processing
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          onProgress?.(progress);
          
          // Return original file for now (in real implementation, use FFmpeg.wasm)
          resolve(file);
        } else {
          onProgress?.(progress);
        }
      }, 200);
    });
  }
  
  async generateThumbnail(file: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.onloadedmetadata = () => {
        canvas.width = 200;
        canvas.height = (200 * video.videoHeight) / video.videoWidth;
        
        video.currentTime = Math.min(1, video.duration / 2); // Seek to middle or 1 second
      };
      
      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to generate video thumbnail'));
            }
          }, 'image/jpeg', 0.8);
        }
      };
      
      video.onerror = () => reject(new Error('Failed to load video'));
      video.src = URL.createObjectURL(file);
    });
  }
}

// Audio file handler
export class AudioFileHandler extends FileTypeHandler<AudioFileOptions> {
  readonly supportedMimeTypes = ['audio/'];
  readonly supportedExportFormats = ['mp3', 'wav', 'ogg', 'flac', 'aac'];
  
  validateOptions(options: AudioFileOptions): boolean {
    return (
      options.type === 'audio' &&
      (options.volume === undefined || (options.volume >= 0 && options.volume <= 200)) &&
      (options.normalization === undefined || (options.normalization >= -20 && options.normalization <= 20)) &&
      (options.bitrate === undefined || (options.bitrate >= 64 && options.bitrate <= 320))
    );
  }
  
  getDefaultOptions(): AudioFileOptions {
    return {
      type: 'audio',
      volume: 100,
      normalization: 0,
      bitrate: 128,
      sampleRate: 44100,
      channels: 2
    };
  }
  
  async processFile(
    file: Blob, 
    options: AudioFileOptions, 
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    // Simulate audio processing
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          onProgress?.(progress);
          
          // Return original file for now (in real implementation, use Web Audio API)
          resolve(file);
        } else {
          onProgress?.(progress);
        }
      }, 150);
    });
  }
  
  async generateThumbnail(file: Blob): Promise<Blob> {
    // Generate a simple waveform visualization
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 200;
      canvas.height = 100;
      
      if (ctx) {
        // Draw simple waveform placeholder
        ctx.fillStyle = '#e5e7eb';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#3b82f6';
        for (let i = 0; i < canvas.width; i += 4) {
          const height = Math.random() * canvas.height;
          ctx.fillRect(i, (canvas.height - height) / 2, 2, height);
        }
      }
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
      }, 'image/png');
    });
  }
}

// Document file handler
export class DocumentFileHandler extends FileTypeHandler<DocumentFileOptions> {
  readonly supportedMimeTypes = ['application/pdf', 'text/', 'application/msword', 'application/vnd.openxmlformats'];
  readonly supportedExportFormats = ['pdf', 'txt', 'docx', 'html'];
  
  validateOptions(options: DocumentFileOptions): boolean {
    return (
      options.type === 'document' &&
      (options.compression === undefined || (options.compression >= 1 && options.compression <= 100))
    );
  }
  
  getDefaultOptions(): DocumentFileOptions {
    return {
      type: 'document',
      compression: 80
    };
  }
  
  async processFile(
    file: Blob, 
    options: DocumentFileOptions, 
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    // Simulate document processing
    return new Promise((resolve) => {
      setTimeout(() => {
        onProgress?.(100);
        resolve(file);
      }, 1000);
    });
  }
  
  async generateThumbnail(file: Blob): Promise<Blob> {
    // Generate document icon thumbnail
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 200;
      canvas.height = 200;
      
      if (ctx) {
        // Draw document icon
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#6b7280';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('📄', canvas.width / 2, canvas.height / 2 + 16);
      }
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
      }, 'image/png');
    });
  }
}

// File type handler registry
export class FileTypeHandlerRegistry {
  private handlers: Map<string, FileTypeHandler<any>> = new Map();
  
  constructor() {
    this.registerHandler('image', new ImageFileHandler());
    this.registerHandler('video', new VideoFileHandler());
    this.registerHandler('audio', new AudioFileHandler());
    this.registerHandler('document', new DocumentFileHandler());
  }
  
  registerHandler(type: string, handler: FileTypeHandler<any>): void {
    this.handlers.set(type, handler);
  }
  
  getHandler(mimeType: string): FileTypeHandler<any> | null {
    for (const [type, handler] of this.handlers) {
      if (handler.canHandle(mimeType)) {
        return handler;
      }
    }
    return null;
  }
  
  getSupportedFormats(mimeType: string): string[] {
    const handler = this.getHandler(mimeType);
    return handler ? handler.supportedExportFormats : [];
  }
  
  validateOptions(mimeType: string, options: FileTypeOptions): boolean {
    const handler = this.getHandler(mimeType);
    return handler ? handler.validateOptions(options) : false;
  }
}

// Export singleton instance
export const fileTypeRegistry = new FileTypeHandlerRegistry();