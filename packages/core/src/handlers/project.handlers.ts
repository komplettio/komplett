import { ProjectCtrl } from '#controllers/project.controller';
import { EventHandler, EventHandlerContext, on, register } from '#events/emitter';
import { Events } from '#events/index';

@register()
export class ProjectHandler extends EventHandler {
  @on('projects.create')
  async createProject(data: Events['projects.create'], ctx: EventHandlerContext<'projects.create'>) {
    console.log('Creating project:', data);
    const res = await ProjectCtrl.create(data.payload);

    await ctx.emitter.respond('projects.create', data, res);
  }

  @on('projects.update')
  async updateProject(data: Events['projects.update'], ctx: EventHandlerContext<'projects.update'>) {
    console.log('Updating project:', data);
    await ProjectCtrl.update(data.payload.id, data.payload.data);

    await ctx.emitter.respond('projects.update', data, null);
  }

  @on('projects.delete')
  async deleteProject(data: Events['projects.delete'], ctx: EventHandlerContext<'projects.delete'>) {
    console.log('Deleting project:', data);
    await ProjectCtrl.delete(data.payload.id);

    await ctx.emitter.respond('projects.delete', data, null);
  }

  @on('projects.get')
  async getProject(data: Events['projects.get'], ctx: EventHandlerContext<'projects.get'>) {
    console.log('Getting project:', data);
    const project = await ProjectCtrl.getById(data.payload.id);

    if (!project) {
      throw new Error(`Project with ID ${data.payload.id} not found`);
    }

    await ctx.emitter.respond('projects.get', data, project);
  }

  @on('projects.list')
  async listProjects(data: Events['projects.list'], ctx: EventHandlerContext<'projects.list'>) {
    console.log('Listing projects:', data);
    const projects = await ProjectCtrl.getMany(data.payload);

    await ctx.emitter.respond('projects.list', data, projects);
  }
}
