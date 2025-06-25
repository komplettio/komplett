import { BaseController } from '#controllers/base.controller';
import { db } from '#db';
import type { TransformerBaseModel, TransformerCreateModel, TransformerModel, TransformerUpdateModel } from '#models';
import type { UUID } from '#types';

class TransformerController extends BaseController<
  TransformerBaseModel,
  TransformerModel,
  TransformerCreateModel,
  TransformerUpdateModel
> {
  constructor() {
    super(db.transformers);
  }

  protected async _serialize(transformer: TransformerBaseModel): Promise<TransformerModel> {
    return db.transaction('r', [db.projects, db.files], async () => {
      const project = await db.projects.get(transformer.projectId);

      if (!project) {
        throw new Error(`Failed to serialize transformer: project with ID ${transformer.projectId} not found`);
      }

      const originalFiles = await db.files.where('id').anyOf(project.fileIds).toArray();
      const resultFiles = await db.files.where('id').anyOf(transformer.resultFileIds).toArray();

      return { ...transformer, originalFiles, resultFiles, project };
    });
  }

  public async updateStatus(id: UUID, status: TransformerBaseModel['status']): Promise<void> {
    await this.update(id, { status });
  }

  public unassignFiles(id: UUID, fileIds: UUID[]): Promise<void> {
    return db.transaction('rw', [db.transformers], async () => {
      const transformer = await this.getBaseById(id);
      if (!transformer) {
        throw new Error(`Transformer with ID ${id} not found`);
      }

      const updatedFileIds = transformer.resultFileIds.filter(fileId => !fileIds.includes(fileId));
      await this.update(id, { resultFileIds: updatedFileIds });
    });
  }
}

export const TransformerCtrl = TransformerController.getInstance();
