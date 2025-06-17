import * as Comlink from 'comlink';

import { optimise_png } from '@komplett/codecs';

import type { FileBaseModel } from '#models/file.models.js';
import type { TransformerImageOptimizeSettings } from '#types';

export class PngWorker {
  public async optimize(file: FileBaseModel, options: TransformerImageOptimizeSettings) {
    const ab = await file.blob.arrayBuffer();
    const result = optimise_png(
      new Uint8Array(ab),
      options.level,
      options.interlace ?? false,
      options.optimizeAlpha ?? false,
    );
    const resImg = new File([result], file.name, { type: file.metadata.mimeType });
    return resImg;
  }
}

Comlink.expose({ PngWorker });

export default null;
