import type { FileBaseModel } from '@komplett/core';

import { formatFileSize } from '#utils/formatters';

import type { ViewerProps } from './BaseViewer';
import SplitView from './SplitView';
import ZoomableView from './ZoomableView';

import './ImageViewer.scss';

export type ImageViewerProps = ViewerProps;

function ImageViewCollage({ originalFile, resultFile }: { originalFile: FileBaseModel; resultFile: FileBaseModel }) {
  const originalUrl = URL.createObjectURL(originalFile.blob);
  const resultUrl = URL.createObjectURL(resultFile.blob);

  return (
    <div className="collage-view">
      <div className="collage-view__item">
        <span className="base-viewer__label base-viewer__label--input">
          {originalFile.name} - {formatFileSize(originalFile.size)}
        </span>
        <img src={originalUrl} alt={originalFile.name} className="preview-image" />
      </div>
      <div className="collage-view__item">
        <span className="base-viewer__label base-viewer__label--result">
          {resultFile.name} - {formatFileSize(resultFile.size)}
        </span>
        <img src={resultUrl} alt={resultFile.name} className="preview-image" />
      </div>
    </div>
  );
}

function ImageViewInput({ originalFile }: { originalFile: FileBaseModel }) {
  const imageUrl = URL.createObjectURL(originalFile.blob);

  return (
    <div>
      <span className="base-viewer__label base-viewer__label--input">
        {originalFile.name} - {formatFileSize(originalFile.size)}
      </span>
      <img src={imageUrl} alt={originalFile.name} className="preview-image" />
    </div>
  );
}

function ImageViewOutput({ resultFile }: { resultFile: FileBaseModel }) {
  const imageUrl = URL.createObjectURL(resultFile.blob);

  return (
    <div>
      <span className="base-viewer__label base-viewer__label--result">
        {resultFile.name} - {formatFileSize(resultFile.size)}
      </span>
      <img src={imageUrl} alt={resultFile.name} className="preview-image" />
    </div>
  );
}

function ImageViewSplit({ originalFile, resultFile }: { originalFile: FileBaseModel; resultFile: FileBaseModel }) {
  const originalUrl = URL.createObjectURL(originalFile.blob);
  const resultUrl = URL.createObjectURL(resultFile.blob);

  return (
    <SplitView originalFile={originalFile} resultFile={resultFile}>
      <img src={originalUrl} alt={originalFile.name} className="preview-image" />
      <img src={resultUrl} alt={resultFile.name} className="preview-image" />
    </SplitView>
  );
}

export default function ImageViewer({ originalFile, resultFile, mode, zoomEnabled }: ImageViewerProps) {
  if (!originalFile) {
    return <div className="base-viewer__loading">Loading...</div>;
  }

  let viewComponent;

  if (mode === 'input') {
    viewComponent = <ImageViewInput originalFile={originalFile} />;
  } else {
    if (!resultFile) {
      return (
        <div className="base-viewer__loading">
          <p>No result file available (yet)</p>
          <span>Hit the process button to get one!</span>
        </div>
      );
    } else {
      if (mode === 'split') {
        viewComponent = <ImageViewSplit originalFile={originalFile} resultFile={resultFile} />;
      } else if (mode === 'collage') {
        viewComponent = <ImageViewCollage originalFile={originalFile} resultFile={resultFile} />;
      } else {
        viewComponent = <ImageViewOutput resultFile={resultFile} />;
      }
    }
  }

  return (
    <ZoomableView className="image-viewer" zoomEnabled={zoomEnabled}>
      {viewComponent}
    </ZoomableView>
  );
}
