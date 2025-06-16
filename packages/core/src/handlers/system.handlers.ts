import { db } from '#db';
import { EventHandler, EventHandlerContext, on, register } from '#events/emitter';
import { Events } from '#events/index';

@register()
export class SystemHandler extends EventHandler {
  @on('system.reset')
  async createProject(data: Events['system.reset'], ctx: EventHandlerContext<'system.reset'>) {
    console.log('Resetting system:', data);

    // Simulate reset process
    await new Promise(resolve => setTimeout(resolve, 1000));
    await db.delete();

    await ctx.emitter.respond('system.reset', data, null);
  }
}
