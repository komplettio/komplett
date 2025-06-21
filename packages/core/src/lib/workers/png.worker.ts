import * as Comlink from 'comlink';

import { Image, ImageOptimizeOpts, KomplettTransformerImage } from '@komplett/transformers';

import type { TransformerSettingsOptimize } from '#types';

export class PngWorker {
  public async optimize(file: File, options: NonNullable<TransformerSettingsOptimize['optimize']>) {
    console.log('trying to get transformer...');
    const transformer = new KomplettTransformerImage(new Image(20, 20, false));

    console.log('PngWorker: optimize', transformer.image.optimized);

    transformer.optimize(
      new ImageOptimizeOpts(options.level, options.interlace ?? false, options.optimizeAlpha ?? false),
    );

    console.log('PngWorker: optimize done', transformer.image.optimized);

    const res = transformer.execute();
    console.log(res.optimized);

    // TODO: Figure out if we should transfer the file array buffer instead?
    return Promise.resolve(new File([], file.name, { type: 'image/png' }));
  }
}

Comlink.expose({ PngWorker });

export default null;
