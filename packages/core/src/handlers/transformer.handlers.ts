import { FileCtrl, TransformerCtrl } from '#controllers';
import type { EventHandlerContext } from '#events/emitter';
import { EventHandler, on, register } from '#events/emitter';
import type { Events } from '#events/index';
import { executeTransformer } from '#lib/transformers';
import type { TransformerExecuteResponse } from '#events';
import { db } from '#db';

@register()
export class TransformerHandler extends EventHandler {
  @on('transformers.create')
  async createTransformer(data: Events['transformers.create'], ctx: EventHandlerContext<'transformers.create'>) {
    console.log('Creating transformer:', data);
    const res = await TransformerCtrl.create(data.payload);

    await ctx.emitter.respond('transformers.create', data, res);
  }

  @on('transformers.update')
  async updateTransformer(data: Events['transformers.update'], ctx: EventHandlerContext<'transformers.update'>) {
    console.log('Updating transformer:', data);
    await TransformerCtrl.update(data.payload.id, data.payload.data);

    await ctx.emitter.respond('transformers.update', data, null);
  }

  @on('transformers.delete')
  async deleteTransformer(data: Events['transformers.delete'], ctx: EventHandlerContext<'transformers.delete'>) {
    console.log('Deleting transformer:', data);
    await TransformerCtrl.delete(data.payload.id);

    await ctx.emitter.respond('transformers.delete', data, null);
  }

  @on('transformers.get')
  async getTransformer(data: Events['transformers.get'], ctx: EventHandlerContext<'transformers.get'>) {
    const transformer = await TransformerCtrl.getById(data.payload.id);

    if (!transformer) {
      throw new Error(`Transformer with ID ${data.payload.id} not found`);
    }

    await ctx.emitter.respond('transformers.get', data, transformer);
  }

  @on('transformers.list')
  async listTransformers(data: Events['transformers.list'], ctx: EventHandlerContext<'transformers.list'>) {
    const transformers = await TransformerCtrl.getMany(data.payload);

    await ctx.emitter.respond('transformers.list', data, transformers);
  }

  @on('transformers.execute')
  async executeTransformer(data: Events['transformers.execute'], ctx: EventHandlerContext<'transformers.execute'>) {
    const transformer = await TransformerCtrl.getById(data.payload.id);
    if (!transformer) {
      throw new Error(`Transformer with ID ${data.payload.id} not found`);
    }

    let responseNr = 0;

    const sendUpdate = (res: TransformerExecuteResponse, final = false) => {
      void ctx.emitter.respond(
        'transformers.execute',
        data,
        res,
        responseNr++,
        final,
        res.status === 'completed' ? 'success' : 'pending',
      );
    };

    const handleEventUpdate = ({ files, message }: TransformerExecuteResponse) => {
      sendUpdate({
        id: transformer.id,
        status: transformer.status,
        message,
        files,
      });
    };

    await TransformerCtrl.update(data.payload.id, { status: 'running', resultFileIds: [] });

    const existingFiles = transformer.resultFileIds;

    try {
      await executeTransformer(transformer, handleEventUpdate);
      await TransformerCtrl.updateStatus(data.payload.id, 'completed');

      sendUpdate(
        {
          id: transformer.id,
          status: transformer.status,
          message: 'File(s) processed successfully!',
        },
        true,
      );

      try {
        // Remove files after the client has received the final update
        // and might already start loading new ones.
        await db.transaction('rw', [db.files, db.transformers, db.projects], async () => {
          await FileCtrl.deleteMany(existingFiles);
          await TransformerCtrl.unassignFiles(data.payload.id, existingFiles);
        });
      } catch (error) {
        console.error('Error removing files:', error);
      }
    } catch (error) {
      await TransformerCtrl.updateStatus(data.payload.id, 'error');

      sendUpdate(
        {
          id: transformer.id,
          status: transformer.status,
          message: 'Processing file(s) failed: ' + (error instanceof Error ? `: ${error.message}` : ''),
        },
        true,
      );
    }
  }

  @on('transformers.stop')
  async stopTransformer(data: Events['transformers.stop'], ctx: EventHandlerContext<'transformers.stop'>) {
    const transformer = await TransformerCtrl.getById(data.payload.id);
    if (!transformer) {
      throw new Error(`Transformer with ID ${data.payload.id} not found`);
    }
    console.log('Stopping transformer:', data, transformer);
    await ctx.emitter.respond('transformers.stop', data, {
      id: transformer.id,
      status: transformer.status,
    });
  }
}
