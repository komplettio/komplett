import { BaseController } from '#controllers/base.controller';
import { db } from '#db';
import { MetadataExtractor } from '#lib/files/metadata-extractor';
import { determineFileKind } from '#lib/files/utils';
import { FileBaseModel, FileCreateModel, FileModel, FileUpdateModel } from '#models/file.models';

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

  public async import(file: File) {
    const kind = determineFileKind(file.type);
    const metadata = await this.metadataExtractor.extractMetadata(file, kind);

    return await this.create({
      name: file.name,
      originalName: file.name,
      blob: file,
      kind,
      metadata,
      size: file.size,
    });
  }
}

export const FileCtrl = FileController.getInstance();
