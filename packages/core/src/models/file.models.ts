import { BaseCreateModel, BaseDeleteModel, BaseModel, BaseUpdateModel } from '#models/base.models';
import { UUID } from '#types/db.types';
import { FileCategory, FileMetadata } from '#types/file.types';

export interface FileBaseModel extends BaseModel {
  size: number;
  name: string;
  originalName: string;
  category: FileCategory;
  blob: Blob;
  metadata: FileMetadata;
}

export type FileCreateModel = BaseCreateModel<FileBaseModel>;
export type FileUpdateModel = BaseUpdateModel<FileBaseModel>;
export type FileDeleteModel = BaseDeleteModel<FileBaseModel>;

export interface FileModel extends FileBaseModel {
  projectId: UUID | undefined;
}
