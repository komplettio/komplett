/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { FileCreateModel, FileDeleteModel, FileModel, FileUpdateModel } from '#models/file.models';
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

export type FileEvents = {
  'file.create': FileCreateEvent;
  'file.update': FileUpdateEvent;
  'file.delete': FileDeleteEvent;
  'file.get': FileGetEvent;
  'file.list': FileListEvent;
  'file.pub': FilePubEvent;
};

export type FileEventResponses = {
  'file.create.resp': FileCreateResponse;
  'file.update.resp': null;
  'file.delete.resp': null;
  'file.get.resp': FileGetResponse;
  'file.list.resp': FileListResponse;
  'file.pub.resp': null;
};
