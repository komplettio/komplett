import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { FileBaseModel } from '@komplett/core';

import { BaseViewerProps } from './BaseViewer';

export type ImageViewerProps = BaseViewerProps;

function SimpleImageView({ originalFile }: { originalFile: FileBaseModel }) {
  const imageUrl = URL.createObjectURL(originalFile.blob);

  return <img src={imageUrl} alt={originalFile.name} className="preview-image" />;
}

function SplitImageView({ originalFile, resultFile }: { originalFile: FileBaseModel; resultFile: FileBaseModel }) {
  const originalUrl = URL.createObjectURL(originalFile.blob);
  const resultUrl = URL.createObjectURL(resultFile.blob);

  return (
    <>
      <img src={originalUrl} alt={originalFile.name} className="preview-image" />
      <img src={resultUrl} alt={resultFile.name} className="preview-image" />
    </>
  );
}

export default function ImageViewer({ originalFile, resultFile, mode, zoomEnabled }: ImageViewerProps) {
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
          <SplitImageView originalFile={originalFile} resultFile={resultFile!} />
        ) : (
          <SimpleImageView originalFile={originalFile} />
        )}
      </TransformComponent>
    </TransformWrapper>
  );
}
