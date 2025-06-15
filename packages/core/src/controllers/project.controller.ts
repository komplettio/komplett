import { BaseController } from '#controllers/base.controller';
import { db } from '#db';
import { ProjectBaseModel, ProjectCreateModel, ProjectModel, ProjectUpdateModel } from '#models/project.models';
import { UUID } from '#types/db.types';

class ProjectController extends BaseController<ProjectBaseModel, ProjectModel, ProjectCreateModel, ProjectUpdateModel> {
  constructor() {
    super(db.projects);
  }

  protected async _serialize(project: ProjectBaseModel): Promise<ProjectModel> {
    const files = await db.files.where('id').anyOf(project.fileIds).toArray();
    const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);

    return Promise.resolve({ ...project, files, size: totalSize });
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
