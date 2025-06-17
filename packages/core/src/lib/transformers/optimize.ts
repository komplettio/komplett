import type { FileKind, TransformerImageOptimizeSettings, TransformerOptimizeSettings } from '#types';

import { getPngWorker } from '../workers';

async function optimizeImage(file: File, options: TransformerImageOptimizeSettings) {
  switch (file.type) {
    case 'image/png': {
      const worker = await getPngWorker();
      return worker.optimize(file, options);
    }
    default: {
      throw new Error(`Unsupported image type for optimization: ${file.type}`);
    }
  }
}

export async function optimize(file: File, fileKind: FileKind, options: TransformerOptimizeSettings | undefined) {
  if (!options) {
    throw new Error('No optimization options provided');
  }

  console.log('Optimizing file:', file, 'with options:', options);
  switch (fileKind) {
    case 'image': {
      const res = await optimizeImage(file, options);
      return res;
    }
    default: {
      throw new Error(`Unsupported file kind for optimization: ${fileKind}`);
    }
  }
}
