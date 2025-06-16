import { FileBaseModel } from '@komplett/core';

import { BaseViewerProps } from './BaseViewer';
import SplitView from './SplitView';
import ZoomableView from './ZoomableView';

export type VideoViewerProps = BaseViewerProps;

function SimpleVideoView({ originalFile }: { originalFile: FileBaseModel }) {
  const videoUrl = URL.createObjectURL(originalFile.blob);

  return (
    <video src={videoUrl} controls className="preview-video" preload="metadata">
      Your browser does not support the video tag.
    </video>
  );
}

function SplitVideoView({ originalFile, resultFile }: { originalFile: FileBaseModel; resultFile: FileBaseModel }) {
  const originalUrl = URL.createObjectURL(originalFile.blob);
  const resultUrl = URL.createObjectURL(resultFile.blob);

  return (
    <SplitView>
      <video src={originalUrl} controls className="preview-video" preload="metadata">
        Your browser does not support the video tag.
      </video>
      <video src={resultUrl} controls className="preview-video" preload="metadata">
        Your browser does not support the video tag.
      </video>
    </SplitView>
  );
}

export default function VideoViewer({ originalFile, resultFile, mode, zoomEnabled }: VideoViewerProps) {
  return (
    <ZoomableView zoomEnabled={zoomEnabled}>
      {mode === 'split' ? (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- In split mode, resultFile is checked to be defined in BaseViewer
        <SplitVideoView originalFile={originalFile} resultFile={resultFile!} />
      ) : (
        <SimpleVideoView originalFile={originalFile} />
      )}
    </ZoomableView>
  );
}
