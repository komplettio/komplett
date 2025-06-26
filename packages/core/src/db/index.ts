import type { Table } from 'dexie';
import Dexie from 'dexie';

import type {
  FileBaseModel,
  FileCreateModel,
  ProjectBaseModel,
  ProjectCreateModel,
  TransformerBaseModel,
  TransformerCreateModel,
} from '#models';
import type { UUID } from '#types/db.types';

const DB_VERSION = 1;

class Database extends Dexie {
  public projects!: Table<ProjectBaseModel, UUID, ProjectCreateModel>;
  public files!: Table<FileBaseModel, UUID, FileCreateModel>;
  public transformers!: Table<TransformerBaseModel, UUID, TransformerCreateModel>;

  constructor() {
    super('komplett');

    this.defineSchema();
    this.setupHooks();
  }

  private defineSchema() {
    this.version(DB_VERSION).stores({
      projects: 'id, createdAt, updatedAt, name, description, fileIds, kind, tags',
      files: 'id, createdAt, updatedAt, name, originalName, kind, blob, metadata',
      transformers: 'id, projectId, kind',
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

    this.projects.hook('deleting', async (_, obj) => {
      // When a project is deleted, also delete associated files and transformers
      await this.files.where('projectId').equals(obj.id).delete();
      await this.transformers.where('projectId').equals(obj.id).delete();
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

    this.transformers.hook('creating', (_, obj) => {
      const now = new Date();
      obj.id = this.generateUUID();
      obj.createdAt = now;
      obj.updatedAt = now;
    });

    this.transformers.hook('updating', (_, __, obj) => {
      obj.updatedAt = new Date();
    });

    this.transformers.hook('deleting', async (_, obj) => {
      // When a transformer is deleted, also delete associated files
      const fileIds = obj.resultFileIds;
      await this.files.bulkDelete(fileIds);
    });
  }

  private generateUUID(): UUID {
    return crypto.randomUUID();
  }
}

export const db = new Database();
