import type { UnsubscribeFunction } from 'emittery';
import Emittery from 'emittery';
import handlery, {
  type Emitter as HandleryEmitter,
  type EventHandlerContext as HandleryEventHandlerContext,
} from 'handlery';

import type {
  BaseEmittableEvents,
  BaseEventResponses,
  BaseEvents,
  EmittableEvents,
  EventResponseKind,
  Events,
} from './types';

const emittery = new Emittery<Events>({
  debug: {
    name: 'komplett',
    enabled: false,
  },
});

export class Emitter implements HandleryEmitter<BaseEvents, Events> {
  private static _eventId = 0;
  private static _instance: Emitter | undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): Emitter {
    Emitter._instance ??= new Emitter();
    return Emitter._instance;
  }

  /**
   * Emits an event with the given name and data.
   * @param eventName The name of the event to emit.
   * @param data The data to send with the event.
   */
  async emit<T extends keyof BaseEvents>(eventName: T, data: BaseEvents[T]): Promise<void> {
    const msg = {
      eventId: Emitter._eventId++,
      kind: eventName,
      timestamp: Date.now(),
      payload: data,
    } as Events[T];

    return emittery.emit(eventName, msg);
  }

  /**
   * Responds to an event with a payload. By default, assumes only one successful response is needed.
   * For errors or multi-chunk responses, set `finalResponse` to false and 'status' to 'error' or 'pending'.
   * @param original The original event that is being responded to.
   * @param payload The payload to send with the response.
   * @param responseId The ID of the response.
   * @param finalResponse Whether this is the final response for the event.
   * @param status The status of the response.
   */
  async respond<T extends keyof BaseEmittableEvents>(
    eventKind: T,
    original: EmittableEvents[T],
    payload: BaseEventResponses[EventResponseKind<T>] | null,
    responseId = 0,
    finalResponse = true,
    status: 'pending' | 'success' | 'error' | 'unknown' = 'success',
  ): Promise<void> {
    const msg = {
      eventId: original.eventId,
      kind: `${eventKind}.resp`,
      responseId,
      finalResponse,
      timestamp: Date.now(),
      status,
      payload,
      original,
    } as unknown as Events[EventResponseKind<T>];

    return emittery.emit(`${eventKind}.resp`, msg);
  }

  /**
   * Emits an event and waits for a response.
   * @param eventName The name of the event to emit.
   * @param data The data to send with the event.
   * @param callback The callback to handle the response.
   */
  async await<T extends keyof BaseEmittableEvents>(
    eventName: T,
    data: BaseEmittableEvents[T],
    callback: (data: BaseEventResponses[EventResponseKind<T>]) => void,
  ): Promise<void> {
    Emitter._eventId++;

    const msg = {
      eventId: Emitter._eventId,
      kind: eventName,
      timestamp: Date.now(),
      payload: data,
    } as Events[T];

    const unsubscribe = emittery.on(`${eventName}.resp`, res => {
      if (res.original.eventId === msg.eventId) {
        callback(res.payload as BaseEventResponses[EventResponseKind<T>]);

        if (res.finalResponse) {
          unsubscribe();
        }
      }
    });

    await emittery.emit(eventName, msg);
  }

  /**
   * Listens for an event and executes the callback when the event is emitted.
   * @param eventName The name of the event to listen for.
   * @param callback The callback to execute when the event is emitted.
   */
  on<T extends keyof BaseEvents>(
    eventName: T | T[],
    callback: (data: Events[T]) => void | Promise<void>,
  ): UnsubscribeFunction {
    return emittery.on(eventName, callback);
  }

  /**
   * Removes a listener for an event.
   * @param eventName The name of the event to stop listening for.
   * @param callback The callback that was previously registered.
   */
  off<T extends keyof BaseEvents>(eventName: T, callback: (data: Events[T]) => void | Promise<void>): void {
    emittery.off(eventName, callback);
  }

  /**
   * Listens for an event and executes the callback once when the event is emitted.
   * @param eventName The name of the event to listen for.
   * @returns A promise that resolves with the event data.
   */
  once<T extends keyof BaseEvents>(
    eventName: T | T[],
    callback: (data: Events[T]) => void | Promise<void>,
  ): UnsubscribeFunction {
    void emittery.once(eventName).then(callback);

    return () => {
      emittery.off(eventName, callback);
    };
  }
}

export const emitter = Emitter.getInstance();

export const { EventHandler, on, subscribe, register } = handlery<BaseEvents, Events, Emitter>(emitter);

export type EventHandlerContext<TKey extends keyof BaseEvents = keyof BaseEvents> = HandleryEventHandlerContext<
  BaseEvents,
  Events,
  Emitter,
  TKey
>;
