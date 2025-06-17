import type { BaseCreateModel, BaseDeleteModel, BaseModel, BaseUpdateModel } from '#models/base.models';
import type { UUID } from '#types/db.types';
import type { FileKind, FileMetadata } from '#types/file.types';

export interface FileBaseModel extends BaseModel {
  size: number;
  name: string;
  originalName: string;
  kind: FileKind;
  blob: File;
  metadata: FileMetadata;
  originalFileId?: UUID | undefined;
}

export type FileCreateModel = BaseCreateModel<FileBaseModel>;
export type FileUpdateModel = BaseUpdateModel<FileBaseModel>;
export type FileDeleteModel = BaseDeleteModel<FileBaseModel>;

export interface FileModel extends FileBaseModel {
  projectId: UUID | undefined;
}
