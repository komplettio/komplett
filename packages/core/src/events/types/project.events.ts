/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { ProjectCreateModel, ProjectDeleteModel, ProjectModel, ProjectUpdateModel } from '#models/project.models';
import { UUID } from '#types/db.types';
import { ListEvent } from '#types/event.types';

export interface ProjectCreateEvent {
  payload: ProjectCreateModel;
}

export interface ProjectUpdateEvent {
  payload: ProjectUpdateModel;
}

export interface ProjectDeleteEvent {
  payload: ProjectDeleteModel;
}

export interface ProjectGetEvent {
  payload: {
    id: UUID;
  };
}

export type ProjectListEvent = ListEvent<ProjectModel>;

export interface ProjectPubEvent {
  payload: ProjectModel[];
}

export interface ProjectCreateResponse {
  payload: {
    id: UUID;
  };
}

export interface ProjectGetResponse {
  payload: ProjectModel;
}

export interface ProjectListResponse {
  payload: ProjectModel[];
}

export type ProjectEvents = {
  'project.create': ProjectCreateEvent;
  'project.update': ProjectUpdateEvent;
  'project.delete': ProjectDeleteEvent;
  'project.get': ProjectGetEvent;
  'project.list': ProjectListEvent;
  'project.pub': ProjectPubEvent;
};

export type ProjectEventResponses = {
  'project.create.resp': ProjectCreateResponse;
  'project.update.resp': null;
  'project.delete.resp': null;
  'project.get.resp': ProjectGetResponse;
  'project.list.resp': ProjectListResponse;
  'project.pub.resp': null;
};
