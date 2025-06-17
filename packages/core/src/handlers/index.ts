import { FileHandler } from './file.handlers';
import { ProjectHandler } from './project.handlers';
import { SystemHandler } from './system.handlers';
import { TransformerHandler } from './transformer.handlers';

export function setupEventHandlers() {
  FileHandler.subscribe();
  ProjectHandler.subscribe();
  SystemHandler.subscribe();
  TransformerHandler.subscribe();
}
