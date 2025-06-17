import type { FileBaseModel, ProjectBaseModel } from '#models';
import type { BaseCreateModel, BaseDeleteModel, BaseModel, BaseUpdateModel } from '#models/base.models';
import type { TransformerKind, TransformerSettingsMap, TransformerStatus, UUID } from '#types';

export interface TransformerBaseModel<T extends TransformerKind = TransformerKind> extends BaseModel {
  projectId: UUID;
  kind: T;
  status: TransformerStatus;
  settings: TransformerSettingsMap[T];
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
