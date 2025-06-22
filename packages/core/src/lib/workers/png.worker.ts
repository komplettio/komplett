import * as Comlink from 'comlink';

import { ImageProcessor } from '@komplett/transformers';

import type { TransformerSettingsOptimize } from '#types';

export class PngWorker {
  public async optimize(file: File, options: NonNullable<TransformerSettingsOptimize['optimize']>) {
    console.log('trying to get transformer...');
    const arr = await file.bytes();

    const processor = new ImageProcessor();

    processor.import(arr);

    processor.optimize(options.level, options.interlace ?? false, options.optimizeAlpha ?? false);

    const res = processor.processTo('jpg');

    // TODO: Figure out if we should transfer the file array buffer instead?
    return Promise.resolve(new File([res], 'output.jpg', { type: 'image/jpeg' }));
  }
}

Comlink.expose({ PngWorker });

export default null;
