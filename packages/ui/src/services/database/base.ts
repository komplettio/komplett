import Dexie, { Table } from 'dexie';
import { DatabaseSchema } from './types';

/**
 * Base database class that handles schema definition and migrations
 */
export class BaseDatabase extends Dexie {
  projects!: Table<DatabaseSchema['projects']>;
  files!: Table<DatabaseSchema['files']>;

  constructor() {
    super('ZeditProjectDB');
    
    this.defineSchema();
    this.setupHooks();
  }

  private defineSchema() {
    // Version 1: Initial schema
    this.version(1).stores({
      projects: '++id, name, createdDate, lastModified, lastAccessed, category, tags',
      files: '++id, projectId, name, originalName, category, mimeType, createdDate, lastModified, lastAccessed, tags, status, &[projectId+originalName]'
    });
  }

  private setupHooks() {
    // Auto-update timestamps for projects
    this.projects.hook('creating', (primKey, obj, trans) => {
      const now = new Date();
      obj.createdDate = now;
      obj.lastModified = now;
      obj.lastAccessed = now;
    });

    this.projects.hook('updating', (modifications, primKey, obj, trans) => {
      modifications.lastModified = new Date();
    });

    // Auto-update timestamps for files
    this.files.hook('creating', (primKey, obj, trans) => {
      const now = new Date();
      obj.createdDate = now;
      obj.lastModified = now;
      obj.lastAccessed = now;
    });

    this.files.hook('updating', (modifications, primKey, obj, trans) => {
      modifications.lastModified = new Date();
    });
  }

  /**
   * Generate a unique ID for database records
   */
  generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  /**
   * Clear all data from the database
   */
  async clearAllData(): Promise<void> {
    await this.transaction('rw', this.projects, this.files, async () => {
      await this.projects.clear();
      await this.files.clear();
    });
  }
}