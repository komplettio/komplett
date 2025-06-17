import { FileCtrl } from '#controllers/file.controller.js';
import { TransformerCtrl } from '#controllers/transformer.controller.js';
import type { TransformerModel } from '#models';
import type { TransformerSettingsImage, UUID } from '#types';

import { optimize } from './optimize';

export async function executeTransformer(transformer: TransformerModel) {
  switch (transformer.kind) {
    case 'image': {
      return executeImageTransformer(transformer);
    }
    default: {
      throw new Error(`Unsupported transformer kind: ${transformer.kind}`);
    }
  }
}

async function executeImageTransformer(transformer: TransformerModel) {
  console.log('Executing image transformer:', transformer);
  const settings = transformer.settings as TransformerSettingsImage;

  const resultFileIds: UUID[] = [];

  for (const inputFile of transformer.inputFiles) {
    if (settings.optimize) {
      const resultBlob = await optimize(inputFile.blob, inputFile.kind, settings.optimize);
      const resultFile = await FileCtrl.import(resultBlob, inputFile.id);
      resultFileIds.push(resultFile.id);
    }

    await TransformerCtrl.update(transformer.id, {
      resultFileIds,
    });
  }

  console.log('Image transformer execution completed, result files:', resultFileIds);
}
