import { BaseCreateModel, BaseDeleteModel, BaseModel, BaseUpdateModel } from '#models/base.models';
import { FileBaseModel } from '#models/file.models';
import { TransformerBaseModel } from '#models/transformer.models';
import { UUID } from '#types/db.types';
import { ProjectKind } from '#types/project.types';

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
  kind: ProjectKind;
  transformer: TransformerBaseModel | undefined;
}
