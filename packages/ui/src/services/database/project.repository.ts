import { BaseDatabase } from './base';
import { BaseRepository, Project } from './types';

/**
 * Repository for project-related database operations
 */
export class ProjectRepository implements BaseRepository<Project> {
  constructor(private db: BaseDatabase) {}

  /**
   * Create a new project
   */
  async create(name: string, description?: string): Promise<number> {
    const project: Omit<Project, 'id'> = {
      name,
      description,
      files: [],
      fileCount: 0,
      totalSize: 0,
      tags: [],
      createdDate: new Date(),
      lastModified: new Date(),
      lastAccessed: new Date(),
      settings: {
        autoSave: true,
        compressionLevel: 80,
        maxVersions: 5,
        autoCleanup: true,
      },
      stats: {
        totalProcessingTime: 0,
        successfulExports: 0,
        failedExports: 0,
      },
    };

    return await this.db.projects.add(project as Project);
  }

  /**
   * Get a project by ID with associated files
   */
  async get(id: string): Promise<Project | undefined> {
    const project = await this.db.projects.get(id);
    if (project) {
      // Update last accessed
      await this.db.projects.update(id, { lastAccessed: new Date() });

      // Load associated files
      const files = await this.db.files.where('projectId').equals(id).toArray();
      project.files = files;
      project.fileCount = files.length;
      project.totalSize = files.reduce((sum, file) => sum + file.size, 0);
    }
    return project;
  }

  /**
   * Get all projects with file counts and sizes
   */
  async getAll(): Promise<Project[]> {
    const projects = await this.db.projects.orderBy('lastModified').reverse().toArray();

    // Load file counts and sizes for each project
    for (const project of projects) {
      const files = await this.db.files.where('projectId').equals(project.id).toArray();
      project.files = files;
      project.fileCount = files.length;
      project.totalSize = files.reduce((sum, file) => sum + file.size, 0);
    }

    return projects;
  }

  /**
   * Update a project
   */
  async update(id: string, updates: Partial<Project>): Promise<void> {
    await this.db.projects.update(id, {
      ...updates,
      lastModified: new Date(),
    });
  }

  /**
   * Delete a project and all associated files
   */
  async delete(id: string): Promise<void> {
    await this.db.transaction('rw', this.db.projects, this.db.files, async () => {
      // Delete all files associated with the project
      const projectFiles = await this.db.files.where('projectId').equals(id).toArray();
      for (const file of projectFiles) {
        await this.deleteFile(file.id);
      }

      await this.db.projects.delete(id);
    });
  }

  /**
   * Update project statistics (file count and total size)
   */
  async updateStats(projectId: string): Promise<void> {
    const files = await this.db.files.where('projectId').equals(projectId).toArray();
    const fileCount = files.length;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    await this.db.projects.update(projectId, {
      fileCount,
      totalSize,
      lastModified: new Date(),
    });
  }

  /**
   * Helper method to delete a file (used in project deletion)
   */
  private async deleteFile(fileId: string): Promise<void> {
    // Delete file
    await this.db.files.delete(fileId);
  }
}
