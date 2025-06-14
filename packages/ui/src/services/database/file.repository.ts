import { BaseDatabase } from './base';
import { ProjectFile, FileCategory, FileTypeOptions, FileMetadata, BaseRepository } from './types';
import { MetadataExtractor } from './metadata.extractor';

/**
 * Repository for file-related database operations
 */
export class FileRepository implements BaseRepository<ProjectFile> {
  private metadataExtractor: MetadataExtractor;

  constructor(private db: BaseDatabase) {
    this.metadataExtractor = new MetadataExtractor();
  }

  /**
   * Save a file to a project with type-safe options and metadata
   */
  async saveFile(
    projectId: string, 
    file: File, 
    options?: Partial<FileTypeOptions>
  ): Promise<ProjectFile> {
    try {
      // Determine file category and create type-safe options
      const category = this.determineFileCategory(file.type);
      const fileOptions = this.createFileOptions(category, options);
      
      // Extract metadata
      const metadata = await this.metadataExtractor.extractMetadata(file, category);
      
      // Check for existing file with same name in project
      const existingFile = await this.db.files
        .where(['projectId', 'originalName'])
        .equals([projectId, file.name])
        .first();

      let projectFile: ProjectFile;
      
      if (existingFile) {
        // Update existing file
        projectFile = await this.updateExistingFile(existingFile, file, fileOptions, metadata);
      } else {
        // Create new file
        projectFile = await this.createNewFile(projectId, file, category, fileOptions, metadata);
      }

      return projectFile;
    } catch (error) {
      console.error('Failed to save file:', error);
      throw error;
    }
  }

  /**
   * Create a new file record
   */
  async create(data: Omit<ProjectFile, 'id'>): Promise<string> {
    return await this.db.files.add(data as ProjectFile);
  }

  /**
   * Get a file by ID
   */
  async get(id: string): Promise<ProjectFile | undefined> {
    const file = await this.db.files.get(id);
    if (file) {
      // Update last accessed
      await this.db.files.update(id, { lastAccessed: new Date() });
    }
    return file;
  }

  /**
   * Get all files ordered by last modified
   */
  async getAll(): Promise<ProjectFile[]> {
    return await this.db.files.orderBy('lastModified').reverse().toArray();
  }

  /**
   * Update a file
   */
  async update(id: string, updates: Partial<ProjectFile>): Promise<void> {
    await this.db.files.update(id, {
      ...updates,
      lastModified: new Date()
    });
  }

  /**
   * Delete a file
   */
  async delete(id: string): Promise<void> {
    await this.db.files.delete(id);
  }

  /**
   * Update existing file with new version
   */
  private async updateExistingFile(
    existingFile: ProjectFile,
    file: File,
    fileOptions: FileTypeOptions,
    metadata: FileMetadata
  ): Promise<ProjectFile> {
    const updatedFile = {
      ...existingFile,
      blob: file,
      size: file.size,
      currentVersion: existingFile.currentVersion + 1,
      options: fileOptions,
      metadata,
      status: 'pending' as const,
      progress: 0,
      lastModified: new Date(),
      lastAccessed: new Date(),
      exportedBlob: undefined,
      targetFormat: undefined,
      lastExportDate: undefined,
      previewGenerated: false
    };

    await this.db.files.update(existingFile.id, updatedFile);
    return updatedFile;
  }

  /**
   * Create a completely new file record
   */
  private async createNewFile(
    projectId: string,
    file: File,
    category: FileCategory,
    fileOptions: FileTypeOptions,
    metadata: FileMetadata
  ): Promise<ProjectFile> {
    const projectFile: ProjectFile = {
      id: this.db.generateId(),
      projectId,
      name: file.name,
      originalName: file.name,
      category,
      mimeType: file.type,
      size: file.size,
      blob: file,
      currentVersion: 1,
      versions: [],
      status: 'pending',
      options: fileOptions,
      metadata,
      tags: [],
      createdDate: new Date(),
      lastModified: new Date(),
      lastAccessed: new Date(),
      previewGenerated: false
    };

    await this.db.files.add(projectFile);
    return projectFile;
  }

  /**
   * Determine file category from MIME type
   */
  private determineFileCategory(mimeType: string): FileCategory {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document';
    return 'other';
  }

  /**
   * Create type-safe file options based on category
   */
  private createFileOptions(category: FileCategory, options?: Partial<FileTypeOptions>): FileTypeOptions {
    const baseOptions = { quality: 90, ...options };
    
    switch (category) {
      case 'image':
        return {
          type: 'image',
          brightness: 100,
          contrast: 100,
          saturation: 100,
          ...baseOptions
        };
      case 'video':
        return {
          type: 'video',
          resolution: 100,
          bitrate: 5000,
          frameRate: 30,
          ...baseOptions
        };
      case 'audio':
        return {
          type: 'audio',
          volume: 100,
          normalization: 0,
          bitrate: 128,
          sampleRate: 44100,
          channels: 2,
          ...baseOptions
        };
      case 'document':
        return {
          type: 'document',
          compression: 80,
          ...baseOptions
        };
      default:
        return {
          type: 'other',
          ...baseOptions
        };
    }
  }
}