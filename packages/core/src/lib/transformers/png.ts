import type { FileBaseModel } from '#models';
import type { TransformerImageOptimizeSettings, TransformerOptimizeSettings } from '#types';

import { getPngWorker } from '../workers';

async function optimizeImage(file: FileBaseModel, options: TransformerImageOptimizeSettings) {
  switch (file.metadata.mimeType) {
    case 'image/png': {
      const worker = await getPngWorker();
      return worker.optimize(file, options);
    }
    default: {
      throw new Error(`Unsupported image type for optimization: ${file.metadata.mimeType}`);
    }
  }
}

export async function optimize(file: FileBaseModel, options: TransformerOptimizeSettings) {
  console.log('Optimizing file:', file, 'with options:', options);
  switch (file.kind) {
    case 'image': {
      const res = await optimizeImage(file, options);
      return res;
    }
    default: {
      throw new Error(`Unsupported file kind for optimization: ${file.kind}`);
    }
  }
}
