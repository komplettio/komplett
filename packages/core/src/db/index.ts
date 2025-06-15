import Dexie, { Table } from 'dexie';

import { FileBaseModel, FileCreateModel, ProjectBaseModel, ProjectCreateModel } from '#models/index';
import { UUID } from '#types/db.types';

const DB_VERSION = 1;

class Database extends Dexie {
  public projects!: Table<ProjectBaseModel, UUID, ProjectCreateModel>;
  public files!: Table<FileBaseModel, UUID, FileCreateModel>;

  constructor() {
    super('komplett');

    this.defineSchema();
    this.setupHooks();
  }

  private defineSchema() {
    this.version(DB_VERSION).stores({
      projects: 'id, createdAt, updatedAt, name, description, fileIds, tags',
      files: 'id, createdAt, updatedAt, name, originalName, category, blob, metadata',
    });
  }

  private setupHooks() {
    // Auto-update timestamps for projects
    this.projects.hook('creating', (_, obj) => {
      const now = new Date();
      obj.id = this.generateUUID();
      obj.createdAt = now;
      obj.updatedAt = now;
    });

    this.projects.hook('updating', (_, __, obj) => {
      obj.updatedAt = new Date();
    });

    // Auto-update timestamps for files
    this.files.hook('creating', (_, obj) => {
      const now = new Date();
      obj.id = this.generateUUID();
      obj.createdAt = now;
      obj.updatedAt = now;
    });

    this.files.hook('updating', (_, __, obj) => {
      obj.updatedAt = new Date();
    });
  }

  private generateUUID(): UUID {
    return crypto.randomUUID();
  }
}

export const db = new Database();
