import { FileCtrl } from '#controllers/file.controller';
import type { EventHandlerContext } from '#events/emitter';
import { EventHandler, on, register } from '#events/emitter';
import type { Events } from '#events/index';

@register()
export class FileHandler extends EventHandler {
  @on('files.create')
  async createFile(data: Events['files.create'], ctx: EventHandlerContext<'files.create'>) {
    console.log('Creating file:', data);
    const res = await FileCtrl.create(data.payload);

    await ctx.emitter.respond('files.create', data, res);
  }

  @on('files.import')
  async importFile(data: Events['files.import'], ctx: EventHandlerContext<'files.import'>) {
    console.log('Importing file:', data);
    const res = await FileCtrl.import(data.payload.file);

    await ctx.emitter.respond('files.import', data, res);
  }

  @on('files.update')
  async updateFile(data: Events['files.update'], ctx: EventHandlerContext<'files.update'>) {
    console.log('Updating file:', data);
    await FileCtrl.update(data.payload.id, data.payload.data);

    await ctx.emitter.respond('files.update', data, null);
  }

  @on('files.delete')
  async deleteFile(data: Events['files.delete'], ctx: EventHandlerContext<'files.delete'>) {
    console.log('Deleting file:', data);
    await FileCtrl.deleteMany(data.payload.ids);

    await ctx.emitter.respond('files.delete', data, null);
  }

  @on('files.get')
  async getFile(data: Events['files.get'], ctx: EventHandlerContext<'files.get'>) {
    const file = await FileCtrl.getById(data.payload.id);

    if (!file) {
      throw new Error(`File with ID ${data.payload.id} not found`);
    }

    await ctx.emitter.respond('files.get', data, file);
  }

  @on('files.list')
  async listFiles(data: Events['files.list'], ctx: EventHandlerContext<'files.list'>) {
    const files = await FileCtrl.getMany(data.payload);

    await ctx.emitter.respond('files.list', data, files);
  }
}
