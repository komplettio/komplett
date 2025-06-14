import { FileCreateModel, FileDeleteModel, FileModel, FileUpdateModel } from '#db/models/file.models';
import { UUID } from '#types/db.types';
import { ListEvent } from '#types/event.types';

export interface FileCreateEvent {
  payload: FileCreateModel;
}

export interface FileUpdateEvent {
  payload: FileUpdateModel;
}

export interface FileDeleteEvent {
  payload: FileDeleteModel;
}

export interface FileGetEvent {
  payload: {
    id: UUID;
  };
}

export type FileListEvent = ListEvent<FileModel>;

export interface FilePubEvent {
  payload: FileModel[];
}

export interface FileCreateResponse {
  payload: {
    id: UUID;
  };
}

export interface FileGetResponse {
  payload: FileModel;
}

export interface FileListResponse {
  payload: FileModel[];
}

export interface FileEvents {
  'File.create': FileCreateEvent;
  'File.update': FileUpdateEvent;
  'File.delete': FileDeleteEvent;
  'File.get': FileGetEvent;
  'File.list': FileListEvent;
  'File.pub': FilePubEvent;
}

export interface FileEventResponses {
  'File.create.resp': FileCreateResponse;
  'File.update.resp': never;
  'File.delete.resp': never;
  'File.get.resp': FileGetResponse;
  'File.list.resp': FileListResponse;
  'File.pub.resp': never;
}
