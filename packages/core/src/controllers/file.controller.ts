import { BaseController } from '#controllers/base.controller';
import { db } from '#db';
import { MetadataExtractor } from '#lib/files/metadata-extractor';
import { determineFileKind } from '#lib/files/utils';
import type { FileBaseModel, FileCreateModel, FileModel, FileUpdateModel } from '#models/file.models';
import type { UUID } from '#types';

class FileController extends BaseController<FileBaseModel, FileModel, FileCreateModel, FileUpdateModel> {
  private metadataExtractor: MetadataExtractor;

  constructor() {
    super(db.files);
    this.metadataExtractor = new MetadataExtractor();
  }

  protected async _serialize(file: FileBaseModel): Promise<FileModel> {
    return db.transaction('r', db.projects, async () => {
      const assignedProject = await db.projects.where('fileIds').equals(file.id).first();

      return {
        ...file,
        projectId: assignedProject?.id,
      };
    });
  }

  public async import(file: File, originalFileId?: UUID) {
    const kind = determineFileKind(file.type);
    console.log(`Importing file of kind: ${kind}`, file);
    const metadata = await this.metadataExtractor.extractMetadata(file, kind);

    let originalFile: FileModel | undefined;
    if (originalFileId) {
      originalFile = await this.getById(originalFileId);
      if (!originalFile) {
        throw new Error(`Original file with ID ${originalFileId} not found`);
      }
    }

    // TODO: Handle this in a better place, in a more robust way
    const originalExtension = originalFile?.name.split('.').pop() ?? 'png';
    const originalNameWithoutExtension = originalFile?.name.replace(`.${originalExtension}`, '');
    const newExtension = file.name.split('.').pop() ?? originalExtension;
    const finalName = originalNameWithoutExtension ? `${originalNameWithoutExtension}.${newExtension}` : file.name;

    return await this.create({
      name: finalName,
      blob: file,
      kind,
      metadata,
      size: file.size,
      originalFileId: originalFile?.id,
    });
  }
}

export const FileCtrl = FileController.getInstance();
