/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { TransformerCreateModel, TransformerDeleteModel, TransformerModel, TransformerUpdateModel } from '#models';
import type { ListEvent, TransformerStatus, UUID } from '#types';

export type TransformerCreateEvent = TransformerCreateModel;

export type TransformerUpdateEvent = {
  id: UUID;
  data: TransformerUpdateModel;
};

export type TransformerDeleteEvent = TransformerDeleteModel;

export type TransformerGetEvent = {
  id: UUID;
};

export type TransformerListEvent = ListEvent<TransformerModel>;

export type TransformerPubEvent = TransformerModel[];

export type TransformerExecuteEvent = {
  id: UUID;
};

export type TransformerCreateResponse = {
  id: UUID;
};

export type TransformerGetResponse = TransformerModel;

export type TransformerListResponse = TransformerModel[];

export type TransformerExecuteResponse = {
  id: UUID;
  status: TransformerStatus;
};

export type TransformerEvents = {
  'transformers.create': TransformerCreateEvent;
  'transformers.update': TransformerUpdateEvent;
  'transformers.delete': TransformerDeleteEvent;
  'transformers.get': TransformerGetEvent;
  'transformers.list': TransformerListEvent;
  'transformers.pub': TransformerPubEvent;
  'transformers.execute': TransformerExecuteEvent;
};

export type TransformerEventResponses = {
  'transformers.create.resp': TransformerCreateResponse;
  'transformers.update.resp': null;
  'transformers.delete.resp': null;
  'transformers.get.resp': TransformerGetResponse;
  'transformers.list.resp': TransformerListResponse;
  'transformers.pub.resp': null;
  'transformers.execute.resp': TransformerExecuteResponse;
};
