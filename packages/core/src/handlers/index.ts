import { FileHandler } from './file.handlers';
import { ProjectHandler } from './project.handlers';

export function setupEventHandlers() {
  FileHandler.subscribe();
  ProjectHandler.subscribe();
}
