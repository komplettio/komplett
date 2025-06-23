import * as Comlink from 'comlink';

import type { ImageWorker } from './image.worker';

const imageWorker = new Worker(new URL('./image.worker.ts', import.meta.url), {
  type: 'module',
});

const imageWorkerInstance = Comlink.wrap<{ ImageWorker: typeof ImageWorker }>(imageWorker);

export function getImageWorker() {
  return new imageWorkerInstance.ImageWorker();
}
