/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { FileKind } from './file.types';

export type TransformerKind = FileKind;

export type TransformerResizeMethod = 'basic';
export type TransformerResizeFillMethod = 'crop' | 'contain' | 'stretch';

export interface TransformerResizeSettings {
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  method: TransformerResizeMethod;
  fillMethod?: TransformerResizeFillMethod;
}

export interface TransformerCropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TransformerImageOptimizeSettings {
  level: number;
  interlace?: boolean;
  optimizeAlpha?: boolean;
}

export type TransformerOptimizeSettings = TransformerImageOptimizeSettings;

export interface TransformerVideoTrimSettings {
  start: number;
  end: number;
}

export type TransformerAudioTrimSettings = TransformerVideoTrimSettings;

export type TransformerSettingsImage = {
  kind: 'image';
  optimize: TransformerImageOptimizeSettings | undefined;
  resize?: TransformerResizeSettings | undefined;
  crop?: TransformerCropSettings | undefined;
};

export type TransformerSettingsVideo = {
  kind: 'video';
  resize?: TransformerResizeSettings | undefined;
  crop?: TransformerCropSettings | undefined;
  trim?: TransformerVideoTrimSettings | undefined;
};

export type TransformerSettingsAudio = {
  kind: 'audio';
  trim?: TransformerAudioTrimSettings | undefined;
};

export type TransformerSettingsDocument = {
  kind: 'document';
};

export type TransformerSettingsText = {
  kind: 'text';
};

export type TransformerSettingsunknown = {
  kind: 'unknown';
};

export type TransformerSettings =
  | TransformerSettingsImage
  | TransformerSettingsVideo
  | TransformerSettingsAudio
  | TransformerSettingsDocument
  | TransformerSettingsText
  | TransformerSettingsunknown;

export type TransformerSettingsMap = {
  image: TransformerSettingsImage;
  video: TransformerSettingsVideo;
  audio: TransformerSettingsAudio;
  document: TransformerSettingsDocument;
  text: TransformerSettingsText;
  unknown: TransformerSettingsunknown;
};
