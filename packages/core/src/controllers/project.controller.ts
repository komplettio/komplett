import { BaseController } from '#controllers/base.controller';
import { db } from '#db';
import { ProjectBaseModel, ProjectCreateModel, ProjectModel, ProjectUpdateModel } from '#models/project.models';

class ProjectController extends BaseController<ProjectBaseModel, ProjectModel, ProjectCreateModel, ProjectUpdateModel> {
  constructor() {
    super(db.projects);
  }

  protected async _serialize(project: ProjectBaseModel) {
    const files = await db.files.where('id').anyOf(project.fileIds).toArray();
    return Promise.resolve({ ...project, files });
  }
}

export const ProjectCtrl = ProjectController.getInstance();
