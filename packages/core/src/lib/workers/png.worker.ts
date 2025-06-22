import * as Comlink from 'comlink';

import { ImageProcessor, makeImage } from '@komplett/transformers';

import type { TransformerSettingsOptimize } from '#types';

export class PngWorker {
  public async optimize(file: File, options: NonNullable<TransformerSettingsOptimize['optimize']>) {
    console.log('trying to get transformer...');
    const arr = await file.bytes();
    const img = makeImage(arr);

    const processor = new ImageProcessor(img);

    processor.optimize(options.level, options.interlace ?? false, options.optimizeAlpha ?? false);
    console.log('optimization added...');

    console.log(processor);
    const res = processor.execute();

    // TODO: Figure out if we should transfer the file array buffer instead?
    return Promise.resolve(new File([res], file.name, { type: 'image/png' }));
  }
}

Comlink.expose({ PngWorker });

export default null;
