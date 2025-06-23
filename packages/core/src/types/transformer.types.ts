import { TRANSFORMER_FEATURES } from '#constants/transformer.constants';
import type { TransformerExecuteResponse } from '#events';
import type { TransformerModel } from '#models';
import type { FileKind, FileType } from '#types';

export type TransformerKind = FileKind;
export type TransformerStatus = 'idle' | 'running' | 'completed' | 'error' | 'canceled' | 'unknown';

export type TransformerResizeMethod = 'nearest' | 'triangle' | 'catmullrom' | 'gaussian' | 'lanczos3';

export type TransformerRotateAngle = 90 | 180 | 270;

export interface TransformerSettingsBase {
  format: FileType;
}

// TODO: Remove the optional main key and instead add that to the TransformerSettings union
export interface TransformerSettingsResize {
  resize?:
    | {
        width: number;
        height: number;
        maintainAspectRatio?: boolean;
        method?: TransformerResizeMethod;
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

export interface TransformerSettingsFilter {
  filter?:
    | {
        grayscale?: boolean;
        invert?: boolean;
        blur?: {
          sigma: number;
        };
        brighten?: {
          amount: number;
        };
        contrast?: {
          amount: number;
        };
        unsharpen?: {
          sigma: number;
          threshold: number;
        };
      }
    | undefined;
}

export interface TransformerSettingsFlip {
  flip?:
    | {
        horizontal?: boolean;
        vertical?: boolean;
      }
    | undefined;
}

export interface TransformerSettingsRotate {
  rotate?:
    | {
        angle: TransformerRotateAngle;
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

export interface TransformerSettingsOptimize {
  optimize?:
    | {
        level: number;
        interlace?: boolean;
        optimizeAlpha?: boolean;
      }
    | undefined;
}

export type TransformerSettings = TransformerSettingsBase &
  TransformerSettingsResize &
  TransformerSettingsRotate &
  TransformerSettingsCrop &
  TransformerSettingsFilter &
  TransformerSettingsFlip &
  TransformerSettingsTrim &
  TransformerSettingsOptimize;

export type TransformerSettingsImage = TransformerSettingsBase &
  TransformerSettingsResize &
  TransformerSettingsRotate &
  TransformerSettingsCrop &
  TransformerSettingsFilter &
  TransformerSettingsFlip &
  TransformerSettingsOptimize;

export type TransformerSettingsVideo = TransformerSettingsBase & TransformerSettingsResize & TransformerSettingsTrim;

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
