import type { TransformerKind, TransformerSetting, TransformerSettings } from '#types';

export const TRANSFORMER_FEATURES = {
  image: ['format', 'optimize', 'resize', 'crop', 'rotate', 'filter', 'flip'],
  video: ['format', 'resize', 'crop', 'trim'],
  audio: ['format', 'trim'],
  document: ['format'],
  text: ['format'],
  unknown: [],
} as const satisfies Record<TransformerKind, TransformerSetting[]>;

export const TRANSFORMER_DEFAULT_SETTINGS = {
  format: 'jpeg',
  resize: {
    width: 100,
    height: 100,
    maintainAspectRatio: true,
    method: 'lanczos3',
  },
  rotate: {
    angle: 90,
  },
  crop: {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  },
  filter: {
    grayscale: false,
    invert: false,
    blur: {
      sigma: 0,
    },
    brighten: {
      amount: 0,
    },
    contrast: {
      amount: 0,
    },
    unsharpen: {
      sigma: 0,
      threshold: 0,
    },
  },
  flip: {
    horizontal: false,
    vertical: false,
  },
  trim: {
    start: 0,
    end: 0,
  },
  optimize: {
    optimizeAlpha: true,
    interlace: false,
    level: 3,
  },
} as const satisfies TransformerSettings;
