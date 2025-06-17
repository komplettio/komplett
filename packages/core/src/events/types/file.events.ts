/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { FileCreateModel, FileDeleteModel, FileModel, FileUpdateModel } from '#models/file.models';
import type { UUID } from '#types/db.types';
import type { ListEvent } from '#types/event.types';

export type FileCreateEvent = FileCreateModel;

export type FileImportEvent = {
  file: File;
};

export type FileUpdateEvent = {
  id: UUID;
  data: FileUpdateModel;
};

export type FileDeleteEvent = FileDeleteModel;

export type FileGetEvent = {
  id: UUID;
};

export type FileListEvent = ListEvent<FileModel>;

export type FilePubEvent = FileModel[];

export type FileCreateResponse = {
  id: UUID;
  data: FileModel;
};

export type FileGetResponse = FileModel;

export type FileListResponse = FileModel[];

export type FileEvents = {
  'files.create': FileCreateEvent;
  'files.import': FileImportEvent;
  'files.update': FileUpdateEvent;
  'files.delete': FileDeleteEvent;
  'files.get': FileGetEvent;
  'files.list': FileListEvent;
  'files.pub': FilePubEvent;
};

export type FileEventResponses = {
  'files.create.resp': FileCreateResponse;
  'files.import.resp': FileCreateResponse;
  'files.update.resp': null;
  'files.delete.resp': null;
  'files.get.resp': FileGetResponse;
  'files.list.resp': FileListResponse;
  'files.pub.resp': null;
};
