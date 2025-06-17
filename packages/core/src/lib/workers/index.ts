import * as Comlink from 'comlink';

import type { PngWorker as TPngWorker } from './png.worker';
import PngWorker from './png.worker.ts?worker&inline';

const instance = Comlink.wrap<{ PngWorker: typeof TPngWorker }>(new PngWorker());

export function getPngWorker() {
  return new instance.PngWorker();
}
