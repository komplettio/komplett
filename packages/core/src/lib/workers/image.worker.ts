import * as Comlink from 'comlink';

import { ImageProcessor } from '@komplett/transformers';

import type { FileBaseModel } from '#models';
import type { ImageMetadata, TransformerSettings } from '#types';

export class ImageWorker {
  private processor: ImageProcessor;
  private file: FileBaseModel | undefined;

  public constructor() {
    this.processor = new ImageProcessor();
  }

  // TODO: Add error handling, clean up logs, etc.
  private handleSettings(settings: TransformerSettings) {
    const metadata = this.file?.metadata as ImageMetadata;

    const originalWidth = metadata.dimensions.width;
    const originalHeight = metadata.dimensions.height;

    if (settings.resize) {
      const resizeSettings = settings.resize;
      console.log('Resizing image with settings:', resizeSettings);

      const targetWidth = Math.round((resizeSettings.width / 100) * originalWidth);
      const targetHeight = Math.round((resizeSettings.height / 100) * originalHeight);

      this.processor.resize(
        targetWidth,
        targetHeight,
        resizeSettings.maintainAspectRatio ?? true,
        resizeSettings.method ?? 'lanczos3',
      );
    }

    if (settings.rotate) {
      const rotateSettings = settings.rotate;
      console.log('Rotating image with settings:', rotateSettings);
      this.processor.rotate(rotateSettings.angle);
    }

    if (settings.crop) {
      const cropSettings = settings.crop;
      // TODO: cropping does not currently work. Fix it.
      console.log('Cropping image with settings:', cropSettings);
      const targetPx = Math.round((cropSettings.x / 100) * originalWidth);
      const targetPy = Math.round((cropSettings.y / 100) * originalHeight);
      const targetWidth = Math.round((cropSettings.width / 100) * originalWidth);
      const targetHeight = Math.round((cropSettings.height / 100) * originalHeight);

      this.processor.crop(targetPx, targetPy, targetWidth, targetHeight);
    }

    if (settings.filter) {
      const filterSettings = settings.filter;

      if (filterSettings.grayscale) {
        console.log('Applying grayscale filter');
        this.processor.grayscale();
      }
      if (filterSettings.invert) {
        console.log('Applying invert filter');
        this.processor.invert();
      }
      if (filterSettings.blur && filterSettings.blur.sigma > 0) {
        const blurSettings = filterSettings.blur;
        console.log('Applying blur with sigma:', blurSettings.sigma);
        this.processor.blur(blurSettings.sigma);
      }
      if (filterSettings.brighten && filterSettings.brighten.amount > 0) {
        const brightenSettings = filterSettings.brighten;
        console.log('Applying brighten with amount:', brightenSettings.amount);
        this.processor.brighten(brightenSettings.amount);
      }
      if (filterSettings.contrast && filterSettings.contrast.amount > 0) {
        const contrastSettings = filterSettings.contrast;
        console.log('Applying contrast with amount:', contrastSettings.amount);
        this.processor.contrast(contrastSettings.amount);
      }
      if (filterSettings.unsharpen && (filterSettings.unsharpen.sigma > 0 || filterSettings.unsharpen.threshold > 0)) {
        const unsharpenSettings = filterSettings.unsharpen;
        console.log(
          'Applying unsharpen with sigma:',
          unsharpenSettings.sigma,
          'and threshold:',
          unsharpenSettings.threshold,
        );
        this.processor.unsharpen(unsharpenSettings.sigma, unsharpenSettings.threshold);
      }
    }

    if (settings.flip) {
      const flipSettings = settings.flip;
      console.log('Flipping image with settings:', flipSettings);
      this.processor.flip(flipSettings.horizontal ?? false, flipSettings.vertical ?? false);
    }
  }

  public async process(file: FileBaseModel, settings: TransformerSettings) {
    console.log('Processing file in worker:', file.name);
    this.file = file;

    const arr: Uint8Array = new Uint8Array(await file.blob.arrayBuffer());

    try {
      this.processor.import(arr);
    } catch (error) {
      console.error('Error importing image data:', error);
      throw new Error(`Failed to import image data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    try {
      this.handleSettings(settings);
    } catch (error) {
      console.error('Error handling settings:', error);
      throw new Error(`Failed to handle settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    try {
      console.log('Executing image processing with format:', settings.format);
      this.processor.exec(settings.format);
    } catch (error) {
      console.error('Error during image processing:', error);
      throw new Error(`Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    let resultBuffer: Uint8Array | undefined;

    if (settings.optimize) {
      const optimizeSettings = settings.optimize;
      console.log('Optimizing image with settings:', optimizeSettings);
      resultBuffer = this.processor.optimize(
        settings.format,
        optimizeSettings.level,
        optimizeSettings.interlace ?? false,
        optimizeSettings.optimizeAlpha ?? true,
      );
    } else {
      console.log('No optimization settings provided, skipping optimization.');
      resultBuffer = this.processor.export(settings.format);
    }

    // TODO: Handle this better
    const originalExtension = file.name.split('.').pop() ?? 'png';
    const originalNameWithoutExtension = file.name.replace(`.${originalExtension}`, '');
    const newExtension = settings.format;
    const finalName = originalNameWithoutExtension ? `${originalNameWithoutExtension}.${newExtension}` : file.name;

    return new File([resultBuffer], finalName, { type: `image/${newExtension}` });
  }
}

Comlink.expose({ ImageWorker });

export default null;
