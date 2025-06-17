/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { ProjectCreateModel, ProjectDeleteModel, ProjectModel, ProjectUpdateModel } from '#models/project.models';
import type { UUID } from '#types/db.types';
import type { ListEvent } from '#types/event.types';

export type ProjectCreateEvent = ProjectCreateModel;

export type ProjectUpdateEvent = {
  id: UUID;
  data: ProjectUpdateModel;
};

export type ProjectDeleteEvent = ProjectDeleteModel;

export type ProjectGetEvent = {
  id: UUID;
};

export type ProjectListEvent = ListEvent<ProjectModel>;

export type ProjectPubEvent = ProjectModel[];

export type ProjectCreateResponse = {
  id: UUID;
};

export type ProjectGetResponse = ProjectModel;

export type ProjectListResponse = ProjectModel[];

export type ProjectEvents = {
  'projects.create': ProjectCreateEvent;
  'projects.update': ProjectUpdateEvent;
  'projects.delete': ProjectDeleteEvent;
  'projects.get': ProjectGetEvent;
  'projects.list': ProjectListEvent;
  'projects.pub': ProjectPubEvent;
};

export type ProjectEventResponses = {
  'projects.create.resp': ProjectCreateResponse;
  'projects.update.resp': null;
  'projects.delete.resp': null;
  'projects.get.resp': ProjectGetResponse;
  'projects.list.resp': ProjectListResponse;
  'projects.pub.resp': null;
};
