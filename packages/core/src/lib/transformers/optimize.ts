import type { FileKind, TransformerSettingsOptimize } from '#types';

import { getPngWorker } from '../workers';

async function optimizeImage(file: File, options: NonNullable<TransformerSettingsOptimize['optimize']>) {
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

export async function optimize(
  file: File,
  fileKind: FileKind,
  options: TransformerSettingsOptimize['optimize'] | undefined,
) {
  if (!options) {
    throw new Error('No optimization options provided');
  }

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
