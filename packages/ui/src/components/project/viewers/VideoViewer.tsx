import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { FileBaseModel } from '@komplett/core';

import { BaseViewerProps } from './BaseViewer';

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
    <>
      <video src={originalUrl} controls className="preview-video" preload="metadata">
        Your browser does not support the video tag.
      </video>
      <video src={resultUrl} controls className="preview-video" preload="metadata">
        Your browser does not support the video tag.
      </video>
    </>
  );
}

export default function VideoViewer({ originalFile, resultFile, mode, zoomEnabled }: VideoViewerProps) {
  return (
    <TransformWrapper
      limitToBounds={false}
      centerOnInit={true}
      disabled={!zoomEnabled}
      panning={{
        allowRightClickPan: false,
      }}
    >
      <TransformComponent wrapperClass="preview-wrapper">
        {mode === 'split' ? (
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- In split mode, resultFile is checked to be defined in BaseViewer
          <SplitVideoView originalFile={originalFile} resultFile={resultFile!} />
        ) : (
          <SimpleVideoView originalFile={originalFile} />
        )}
      </TransformComponent>
    </TransformWrapper>
  );
}
