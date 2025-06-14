import { BaseController } from '#controllers/base.controller';
import { db } from '#db';
import { FileBaseModel, FileCreateModel, FileModel, FileUpdateModel } from '#models/file.models';

class FileController extends BaseController<FileBaseModel, FileModel, FileCreateModel, FileUpdateModel> {
  constructor() {
    super(db.files);
  }

  protected _serialize(file: FileBaseModel) {
    return Promise.resolve(file);
  }
}

export const FileCtrl = FileController.getInstance();
