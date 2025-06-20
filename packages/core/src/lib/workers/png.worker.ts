import * as Comlink from 'comlink';

import { optimise_png } from '@komplett/codecs';

import type { TransformerSettingsOptimize } from '#types';

export class PngWorker {
  public async optimize(file: File, options: NonNullable<TransformerSettingsOptimize['optimize']>) {
    const ab = await file.arrayBuffer();
    const result = optimise_png(
      new Uint8Array(ab),
      options.level,
      options.interlace ?? false,
      options.optimizeAlpha ?? false,
    );
    const resImg = new File([result], file.name, { type: 'image/png' });
    // TODO: Figure out if we should transfer the file array buffer instead?
    return resImg;
  }
}

Comlink.expose({ PngWorker });

export default null;
