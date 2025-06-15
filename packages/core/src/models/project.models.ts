import { BaseCreateModel, BaseDeleteModel, BaseModel, BaseUpdateModel } from '#models/base.models';
import { FileBaseModel } from '#models/file.models';
import { UUID } from '#types/db.types';

export interface ProjectBaseModel extends BaseModel {
  name: string;
  description: string;
  fileIds: UUID[];
  tags: string[];
}

export type ProjectCreateModel = BaseCreateModel<ProjectBaseModel>;
export type ProjectUpdateModel = BaseUpdateModel<ProjectBaseModel>;
export type ProjectDeleteModel = BaseDeleteModel<ProjectBaseModel>;

export interface ProjectModel extends ProjectBaseModel {
  files: FileBaseModel[];
  size: number; // Total size of all files in the project
}
