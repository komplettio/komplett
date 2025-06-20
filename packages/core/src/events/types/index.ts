import type { FileEventResponses, FileEvents } from './file.events';
import type { ProjectEventResponses, ProjectEvents } from './project.events';
import type { SystemEventResponses, SystemEvents } from './system.events';
import type { TransformerEventResponses, TransformerEvents } from './transformer.events';

export * from './file.events';
export * from './project.events';
export * from './system.events';
export * from './transformer.events';

export type BaseEmittableEvents = ProjectEvents & FileEvents & SystemEvents & TransformerEvents;
export type BaseEventResponses = ProjectEventResponses &
  FileEventResponses &
  SystemEventResponses &
  TransformerEventResponses;

export type EventStatus = 'pending' | 'success' | 'error' | 'unknown';
export type EventResponseKind<T extends keyof EmittableEvents> = `${T}.resp`;

export type EmittableEvents = {
  [K in keyof BaseEmittableEvents]: {
    eventId: number;
    kind: K;
    timestamp: number;
    payload: BaseEmittableEvents[K] extends never ? null : BaseEmittableEvents[K];
  };
};

export type EventResponses = {
  [K in keyof EmittableEvents as EventResponseKind<K>]: {
    eventId: number;
    kind: EventResponseKind<K>;
    responseId: number;
    finalResponse: boolean;
    timestamp: number;
    status: EventStatus;
    payload: BaseEventResponses[EventResponseKind<K>] extends never ? null : BaseEventResponses[EventResponseKind<K>];
    original: EmittableEvents[K];
  };
};

export type BaseEvents = BaseEmittableEvents & BaseEventResponses;
export type Events = EmittableEvents & EventResponses;

export type Event = keyof Events;
export type EmittableEvent = keyof EmittableEvents;
