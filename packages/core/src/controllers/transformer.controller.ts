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

      const inputFiles = await db.files.where('id').anyOf(project.fileIds).toArray();
      const resultFiles = await db.files.where('id').anyOf(transformer.resultFileIds).toArray();

      return { ...transformer, inputFiles, resultFiles, project };
    });
  }

  public async updateStatus(id: UUID, status: TransformerBaseModel['status']): Promise<void> {
    await this.update(id, { status });
  }
}

export const TransformerCtrl = TransformerController.getInstance();
