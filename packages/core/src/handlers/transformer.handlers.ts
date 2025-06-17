import { TransformerCtrl } from '#controllers/transformer.controller';
import type { EventHandlerContext } from '#events/emitter';
import { EventHandler, on, register } from '#events/emitter';
import type { Events } from '#events/index';
import { executeTransformer } from '#lib/transformers';
import { liveQuery } from 'dexie';

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
    console.log('Getting transformer:', data);
    const transformer = await TransformerCtrl.getById(data.payload.id);

    if (!transformer) {
      throw new Error(`Transformer with ID ${data.payload.id} not found`);
    }

    await ctx.emitter.respond('transformers.get', data, transformer);
  }

  @on('transformers.list')
  async listTransformers(data: Events['transformers.list'], ctx: EventHandlerContext<'transformers.list'>) {
    console.log('Listing transformers:', data);
    const transformers = await TransformerCtrl.getMany(data.payload);

    await ctx.emitter.respond('transformers.list', data, transformers);
  }

  @on('transformers.execute')
  async executeTransformer(data: Events['transformers.execute'], ctx: EventHandlerContext<'transformers.execute'>) {
    const transformer = await TransformerCtrl.getById(data.payload.id);
    if (!transformer) {
      throw new Error(`Transformer with ID ${data.payload.id} not found`);
    }
    console.log('Executing transformer:', data, transformer);

    let responseNr = 0;

    const transformerObserver = liveQuery(() => TransformerCtrl.getById(data.payload.id));
    const responderSubscription = transformerObserver.subscribe(updatedTransformer => {
      if (!updatedTransformer) {
        console.error(`Transformer with ID ${data.payload.id} not found during execution`);
        return;
      }

      void ctx.emitter.respond(
        'transformers.execute',
        data,
        {
          id: updatedTransformer.id,
          status: updatedTransformer.status,
        },
        responseNr++,
        false,
        'pending',
      );
    });

    await TransformerCtrl.updateStatus(data.payload.id, 'running');

    try {
      await executeTransformer(transformer);
      responderSubscription.unsubscribe();
      await TransformerCtrl.updateStatus(data.payload.id, 'completed');

      await ctx.emitter.respond(
        'transformers.execute',
        data,
        {
          id: transformer.id,
          status: 'completed',
        },
        responseNr++,
        true,
        'success',
      );
    } catch (error) {
      responderSubscription.unsubscribe();
      await TransformerCtrl.updateStatus(data.payload.id, 'error');

      await ctx.emitter.respond(
        'transformers.execute',
        data,
        {
          id: transformer.id,
          status: 'error',
        },
        responseNr++,
        true,
        'error',
      );
      throw error;
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
