import type { FileBaseModel } from '@komplett/core';

import type { BaseViewerProps } from './BaseViewer';
import SplitView from './SplitView';
import ZoomableView from './ZoomableView';

export type ImageViewerProps = BaseViewerProps;

function SimpleImageView({ originalFile }: { originalFile: FileBaseModel }) {
  const imageUrl = URL.createObjectURL(originalFile.blob);

  return <img src={imageUrl} alt={originalFile.name} className="preview-image" />;
}

function SplitImageView({ originalFile, resultFile }: { originalFile: FileBaseModel; resultFile: FileBaseModel }) {
  const originalUrl = URL.createObjectURL(originalFile.blob);
  const resultUrl = URL.createObjectURL(resultFile.blob);

  return (
    <SplitView>
      <img src={originalUrl} alt={originalFile.name} className="preview-image" />
      <img src={resultUrl} alt={resultFile.name} className="preview-image" />
    </SplitView>
  );
}

export default function ImageViewer({ originalFile, resultFile, mode, zoomEnabled }: ImageViewerProps) {
  return (
    <ZoomableView zoomEnabled={zoomEnabled}>
      {mode === 'split' ? (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- In split mode, resultFile is checked to be defined in BaseViewer
        <SplitImageView originalFile={originalFile} resultFile={resultFile!} />
      ) : (
        <SimpleImageView originalFile={originalFile} />
      )}
    </ZoomableView>
  );
}
