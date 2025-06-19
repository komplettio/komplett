import type { FileBaseModel, ProjectBaseModel } from '#models';
import type { BaseCreateModel, BaseDeleteModel, BaseModel, BaseUpdateModel } from '#models/base.models';
import type { TransformerKind, TransformerSettings, TransformerStatus, UUID } from '#types';

export interface TransformerBaseModel extends BaseModel {
  projectId: UUID;
  kind: TransformerKind;
  status: TransformerStatus;
  settings: TransformerSettings;
  resultFileIds: UUID[];
}

export type TransformerCreateModel = BaseCreateModel<TransformerBaseModel>;
export type TransformerUpdateModel = BaseUpdateModel<TransformerBaseModel>;
export type TransformerDeleteModel = BaseDeleteModel<TransformerBaseModel>;

export interface TransformerModel extends TransformerBaseModel {
  project: ProjectBaseModel;
  inputFiles: FileBaseModel[];
  resultFiles: FileBaseModel[];
}
