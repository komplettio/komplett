import { BaseDatabase } from './base';
import { FileRepository } from './file.repository';
import { ProjectRepository } from './project.repository';
import { StorageStats } from './types';

/**
 * Main database service that orchestrates all repositories
 */
export class DatabaseService {
  private database: BaseDatabase;
  private projectRepo: ProjectRepository;
  private fileRepo: FileRepository;

  constructor() {
    this.database = new BaseDatabase();
    this.projectRepo = new ProjectRepository(this.database);
    this.fileRepo = new FileRepository(this.database);
  }

  /**
   * Initialize the database connection
   */
  async open(): Promise<void> {
    await this.database.open();
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    await this.database.close();
  }

  // Project operations
  async createProject(name: string, description?: string): Promise<string> {
    const projectId = await this.projectRepo.create(name, description);
    await this.projectRepo.updateStats(projectId);
    return projectId;
  }

  async getProject(id: number): Promise<import('./types').Project | undefined> {
    return await this.projectRepo.get(id);
  }

  async getAllProjects(): Promise<import('./types').Project[]> {
    return await this.projectRepo.getAll();
  }

  async updateProject(id: number, updates: Partial<import('./types').Project>): Promise<void> {
    await this.projectRepo.update(id, updates);
  }

  async deleteProject(id: number): Promise<void> {
    await this.projectRepo.delete(id);
  }

  // File operations
  async saveFile(
    projectId: number,
    file: File,
    options?: Partial<import('./types').FileTypeOptions>,
  ): Promise<import('./types').ProjectFile> {
    const projectFile = await this.fileRepo.saveFile(projectId, file, options);
    await this.projectRepo.updateStats(projectId);
    return projectFile;
  }

  async getFile(id: string): Promise<import('./types').ProjectFile | undefined> {
    return await this.fileRepo.get(id);
  }

  async getAllFiles(): Promise<import('./types').ProjectFile[]> {
    return await this.fileRepo.getAll();
  }

  async updateFile(id: string, updates: Partial<import('./types').ProjectFile>): Promise<void> {
    await this.fileRepo.update(id, updates);

    // Update project stats if file size changed
    if (updates.size !== undefined) {
      const file = await this.fileRepo.get(id);
      if (file) {
        await this.projectRepo.updateStats(file.projectId);
      }
    }
  }

  async deleteFile(id: string): Promise<void> {
    const file = await this.fileRepo.get(id);
    if (file) {
      await this.fileRepo.delete(id);
      await this.projectRepo.updateStats(file.projectId);
    }
  }

  // Utility operations
  async getStorageStats(): Promise<StorageStats> {
    const projects = await this.database.projects.count();
    const files = await this.database.files.toArray();
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    return {
      projectCount: projects,
      fileCount: files.length,
      totalSize,
    };
  }

  async clearAllData(): Promise<void> {
    await this.database.clearAllData();
  }
}

// Export singleton instance
export const db = new DatabaseService();

// Re-export types for convenience
export * from './types';
