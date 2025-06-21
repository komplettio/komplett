import * as Comlink from 'comlink';

import type { PngWorker } from './png.worker';

const pngWorker = new Worker(new URL('./png.worker.ts', import.meta.url), {
  type: 'module',
});

const instance = Comlink.wrap<{ PngWorker: typeof PngWorker }>(pngWorker);

export function getPngWorker() {
  return new instance.PngWorker();
}
