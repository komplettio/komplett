import type { FileBaseModel, VideoMetadata } from '@komplett/core';

import { formatFileSize } from '#utils/formatters';

import type { ViewerProps } from './BaseViewer';
import SplitView from './SplitView';
import ZoomableView from './ZoomableView';

export type VideoViewerProps = ViewerProps;

function VideoViewInput({ originalFile }: { originalFile: FileBaseModel }) {
  const videoUrl = URL.createObjectURL(originalFile.blob);

  return (
    <div>
      <span className="base-viewer__label base-viewer__label--input">
        {originalFile.name} - {formatFileSize(originalFile.size)}
      </span>
      <video src={videoUrl} className="preview-video" preload="metadata">
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

function VideoViewOutput({ resultFile }: { resultFile: FileBaseModel }) {
  const videoUrl = URL.createObjectURL(resultFile.blob);

  return (
    <div>
      <span className="base-viewer__label base-viewer__label--result">
        {resultFile.name} - {formatFileSize(resultFile.size)}
      </span>
      <video src={videoUrl} className="preview-video" preload="metadata">
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

function VideoViewSplit({ originalFile, resultFile }: { originalFile: FileBaseModel; resultFile: FileBaseModel }) {
  const originalUrl = URL.createObjectURL(originalFile.blob);
  const resultUrl = URL.createObjectURL(resultFile.blob);

  return (
    <SplitView originalFile={originalFile} resultFile={resultFile}>
      <video src={originalUrl} className="preview-video" preload="metadata">
        Your browser does not support the video tag.
      </video>
      <video src={resultUrl} className="preview-video" preload="metadata">
        Your browser does not support the video tag.
      </video>
    </SplitView>
  );
}

export default function VideoViewer({ originalFile, resultFile, mode }: VideoViewerProps) {
  if (!originalFile) {
    return <div className="base-viewer__loading">Loading...</div>;
  }

  const videoMetadata = originalFile.metadata as VideoMetadata;

  let viewComponent;

  if (mode === 'input') {
    viewComponent = <VideoViewInput originalFile={originalFile} />;
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
        viewComponent = <VideoViewSplit originalFile={originalFile} resultFile={resultFile} />;
      } else {
        viewComponent = <VideoViewOutput resultFile={resultFile} />;
      }
    }
  }

  return (
    <ZoomableView
      className="image-viewer"
      zoomEnabled={true}
      contentWidth={videoMetadata.dimensions.width}
      contentHeight={videoMetadata.dimensions.height}
    >
      {viewComponent}
    </ZoomableView>
  );
}
