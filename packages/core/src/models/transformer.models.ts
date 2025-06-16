import { BaseCreateModel, BaseDeleteModel, BaseModel, BaseUpdateModel } from '#models/base.models';
import { FileBaseModel } from '#models/file.models';
import { UUID } from '#types/db.types';
import { TransformerKind, TransformerSettingsMap } from '#types/transformer.types';

import { ProjectBaseModel } from './project.models';

export interface TransformerBaseModel<T extends TransformerKind = TransformerKind> extends BaseModel {
  projectId: UUID;
  kind: T;
  settings: TransformerSettingsMap[T];
}

export type TransformerCreateModel = BaseCreateModel<TransformerBaseModel>;
export type TransformerUpdateModel = BaseUpdateModel<TransformerBaseModel>;
export type TransformerDeleteModel = BaseDeleteModel<TransformerBaseModel>;

export interface TransformerModel extends TransformerBaseModel {
  project: ProjectBaseModel;
  files: FileBaseModel[];
}
