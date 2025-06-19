import { TRANSFORMER_FEATURES } from '#constants/transformer.constants.js';
import type { TransformerModel } from '#models';

import type { FileKind } from './file.types';

export type TransformerKind = FileKind;
export type TransformerStatus = 'idle' | 'running' | 'completed' | 'error' | 'canceled' | 'unknown';

export type TransformerResizeMethod = 'basic';
export type TransformerResizeFillMethod = 'crop' | 'contain' | 'stretch';

export interface TransformerSettingsResize {
  resize?:
    | {
        width?: number;
        height?: number;
        maintainAspectRatio?: boolean;
        method: TransformerResizeMethod;
        fillMethod?: TransformerResizeFillMethod;
      }
    | undefined;
}

export interface TransformerSettingsCrop {
  crop?:
    | {
        x: number;
        y: number;
        width: number;
        height: number;
      }
    | undefined;
}

export interface TransformerSettingsOptimize {
  optimize?:
    | {
        level: number;
        interlace?: boolean;
        optimizeAlpha?: boolean;
      }
    | undefined;
}

export interface TransformerSettingsTrim {
  trim?:
    | {
        start: number;
        end: number;
      }
    | undefined;
}

export type TransformerSettings = TransformerSettingsResize &
  TransformerSettingsCrop &
  TransformerSettingsOptimize &
  TransformerSettingsTrim;

export type TransformerSetting = keyof TransformerSettings;

export function transformerHasSetting<TTransformer extends TransformerModel, TSetting extends TransformerSetting>(
  transformer: TTransformer,
  setting: TSetting,
): transformer is TTransformer & {
  settings: Required<Pick<TransformerSettings, TSetting>> & Partial<TransformerSettings>;
} {
  const features = TRANSFORMER_FEATURES[transformer.kind] as TransformerSetting[];

  return features.includes(setting);
}
