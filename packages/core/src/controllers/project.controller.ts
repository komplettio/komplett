import { BaseController } from '#controllers/base.controller';
import { db } from '#db';
import type { ProjectBaseModel, ProjectCreateModel, ProjectModel, ProjectUpdateModel } from '#models/project.models';
import type { UUID } from '#types/db.types';
import type { ProjectKind } from '#types/project.types.js';

import { TransformerCtrl } from './transformer.controller';

class ProjectController extends BaseController<ProjectBaseModel, ProjectModel, ProjectCreateModel, ProjectUpdateModel> {
  constructor() {
    super(db.projects);
  }

  protected async _serialize(project: ProjectBaseModel): Promise<ProjectModel> {
    return db.transaction('r', [db.files, db.transformers], async () => {
      const files = await db.files.where('id').anyOf(project.fileIds).toArray();
      const transformer = await db.transformers.where('projectId').equals(project.id).first();

      const kind = files.reduce<ProjectKind>((acc, file) => {
        if (acc === 'unknown' || file.kind === acc) {
          return file.kind;
        }
        return 'unknown';
      }, 'unknown');

      if (!transformer) {
        throw new Error(`Transformer for project ${project.id} not found`);
      }

      const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);

      return { ...project, files, size: totalSize, transformer, kind };
    });
  }

  public async create(data: ProjectCreateModel): Promise<{ id: UUID; data: ProjectBaseModel }> {
    // TODO: Confirm that transactions behave as expected when calling `super` in them.
    return db.transaction('rw', [db.projects, db.transformers, db.files], async () => {
      const project = await super.create(data);
      const files = await db.files.where('id').anyOf(project.data.fileIds).toArray();
      const kind = files.reduce<ProjectKind>((acc, file) => {
        if (acc === 'unknown' || file.kind === acc) {
          return file.kind;
        }
        return 'unknown';
      }, 'unknown');

      // create transformer
      await TransformerCtrl.create({
        projectId: project.id,
        kind,
        settings: {
          kind,
        },
        resultFileIds: [],
        status: 'idle',
      });

      return project;
    });
  }

  public async assignFiles(projectId: UUID, fileIds: UUID[]): Promise<void> {
    const project = await db.projects.get(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    // Ensure fileIds is unique
    const uniqueFileIds = Array.from(new Set([...project.fileIds, ...fileIds]));

    // Update the project with the new fileIds
    await db.projects.update(projectId, { fileIds: uniqueFileIds });
  }
}

export const ProjectCtrl = ProjectController.getInstance();
