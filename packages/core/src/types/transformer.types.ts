import { TRANSFORMER_FEATURES } from '#constants/transformer.constants.js';
import type { TransformerExecuteResponse } from '#events/index.js';
import type { TransformerModel } from '#models';

import type { FileKind } from './file.types';

export type TransformerKind = FileKind;
export type TransformerStatus = 'idle' | 'running' | 'completed' | 'error' | 'canceled' | 'unknown';

export type TransformerResizeMethod = 'basic';
export type TransformerResizeFillMethod = 'crop' | 'contain' | 'stretch';

// TODO: Remove the optional main key and instead add that to the TransformerSettings union
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

export type TransformerSettingsImage = TransformerSettingsResize &
  TransformerSettingsCrop &
  TransformerSettingsOptimize;
export type TransformerSettingsVideo = TransformerSettingsResize & TransformerSettingsTrim;

export type TransformerSetting = keyof TransformerSettings;

export type TransformerExecuteCallback = (response: TransformerExecuteResponse) => void;

export function transformerHasSetting<TTransformer extends TransformerModel, TSetting extends TransformerSetting>(
  transformer: TTransformer,
  setting: TSetting,
): transformer is TTransformer & {
  settings: Required<Pick<TransformerSettings, TSetting>> & Partial<TransformerSettings>;
} {
  const features = TRANSFORMER_FEATURES[transformer.kind] as TransformerSetting[];

  return features.includes(setting);
}
