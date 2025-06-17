import { db } from '#db';
import type { EventHandlerContext} from '#events/emitter';
import { EventHandler, on, register } from '#events/emitter';
import type { Events } from '#events/index';

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
