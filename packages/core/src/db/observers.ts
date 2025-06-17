import Dexie, { liveQuery } from 'dexie';

import { FileCtrl } from '#controllers/file.controller';
import { ProjectCtrl } from '#controllers/project.controller';
import type { BaseEvents} from '#events/index';
import { emitter } from '#events/index';

function emitOnChange<TE extends keyof BaseEvents>(event: TE, queryFn: () => Promise<BaseEvents[TE]>) {
  // Note: According to the Dexie docs, you are not supposed to call non-dexie async APIs from within
  // a live query: https://dexie.org/docs/liveQuery()#rules-for-the-querier-function
  // Frankly, I have no idea if wrapping in Dexie.waitFor() is a proper solution or not.
  const observable = liveQuery(async () => Dexie.waitFor(queryFn()));

  return observable.subscribe({
    next: result => {
      void emitter.emit(event, result);
    },
    error: error => {
      console.error(error);
    },
  });
}

export function setupDbObservers() {
  const subscriptions = [
    emitOnChange('projects.pub', () => ProjectCtrl.getMany()),
    emitOnChange('files.pub', () => FileCtrl.getMany()),
  ];

  return () => {
    subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  };
}
