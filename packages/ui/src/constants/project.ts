import type { ProjectKind } from '@komplett/core';

import type { ViewerMode } from '#types/viewer.types.js';

export const SUPPORTED_VIEWER_MODE: Record<ProjectKind, ViewerMode[]> = {
  image: ['simple', 'split'],
  video: ['simple'],
  audio: ['simple'],
  text: ['simple'],
  document: ['simple'],
  unknown: ['simple'],
};
