import { FileCtrl } from '#controllers/file.controller';
import { TransformerCtrl } from '#controllers/transformer.controller';
import type { TransformerModel } from '#models';
import type { TransformerExecuteCallback, TransformerSettingsImage, TransformerStatus, UUID } from '#types';

import { getImageWorker } from '../workers';

export async function executeTransformer(
  transformer: TransformerModel,
  callback: TransformerExecuteCallback,
): Promise<void> {
  switch (transformer.kind) {
    case 'image': {
      return executeImageTransformer(transformer, callback);
    }
    default: {
      throw new Error(`Sorry, ${transformer.kind} files are not supported yet.`);
    }
  }
}

async function executeImageTransformer(
  transformer: TransformerModel,
  callback: TransformerExecuteCallback,
): Promise<void> {
  const settings = transformer.settings as TransformerSettingsImage;

  const getFileStates: (fileIds: UUID[]) => Record<UUID, TransformerStatus> = fileIds => {
    const states: Record<UUID, TransformerStatus> = {};
    for (const id of fileIds) {
      states[id] = 'completed';
    }
    return states;
  };

  const resultFileIds: UUID[] = [];

  const workerPromises = transformer.originalFiles.map(async originalFile => {
    if (settings.optimize) {
      callback({
        id: transformer.id,
        status: transformer.status,
        message: `Processing file ${originalFile.name}...`,
        files: getFileStates(resultFileIds),
      });
      try {
        const worker = getImageWorker();
        console.log('created worker', worker);
        const resultBlob = await (await worker).process(originalFile, settings);
        const resultFile = await FileCtrl.import(resultBlob, originalFile.id);
        resultFileIds.push(resultFile.id);

        callback({
          id: transformer.id,
          status: transformer.status,
          message: `File ${originalFile.name} optimized successfully!`,
          files: getFileStates(resultFileIds),
        });
      } catch (error) {
        callback({
          id: transformer.id,
          status: transformer.status,
          message: `Error optimizing file ${originalFile.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          files: getFileStates(resultFileIds),
        });
      }
    }

    await TransformerCtrl.update(transformer.id, {
      resultFileIds,
    });
  });

  await Promise.all(workerPromises);

  console.log('Image transformer execution completed, result files:', resultFileIds);
}
