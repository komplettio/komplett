import type { ProjectKind } from '@komplett/core';

import type { ViewerMode } from '#types/viewer.types.js';

export const SUPPORTED_VIEWER_MODE: Record<ProjectKind, ViewerMode[]> = {
  image: ['input', 'output', 'split', 'collage'],
  video: ['input', 'output', 'split'],
  audio: ['input', 'output'],
  text: ['input', 'output'],
  document: ['input', 'output'],
  unknown: ['input', 'output'],
};
