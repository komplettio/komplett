import type { TransformerKind, TransformerSetting, TransformerSettings } from '#types';

export const TRANSFORMER_FEATURES = {
  image: ['optimize', 'resize', 'crop'],
  video: ['resize', 'crop', 'trim'],
  audio: ['trim'],
  document: [],
  text: [],
  unknown: [],
} as const satisfies Record<TransformerKind, TransformerSetting[]>;

export const TRANSFORMER_DEFAULT_SETTINGS = {
  optimize: {
    optimizeAlpha: true,
    interlace: false,
    level: 5,
  },
  resize: {
    maintainAspectRatio: true,
    fillMethod: 'crop',
    method: 'basic',
  },
  crop: {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  },
  trim: {
    start: 0,
    end: 0,
  },
} as const satisfies TransformerSettings;
