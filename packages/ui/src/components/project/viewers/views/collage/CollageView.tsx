import { KeepScale } from 'react-zoom-pan-pinch';

import type { FileBaseModel } from '@komplett/core';

import { formatFileSize } from '#utils/formatters/index.js';

export interface CollageViewProps {
  originalFile: FileBaseModel;
  resultFile: FileBaseModel | undefined;
  children: [React.ReactNode, React.ReactNode];
}

export default function CollageView({ originalFile, resultFile, children }: CollageViewProps) {
  return (
    <div className="collage-view">
      <div className="collage-view__item">
        <KeepScale className="base-viewer__label base-viewer__label--input">
          {originalFile.name} - {formatFileSize(originalFile.size)}
        </KeepScale>
        {children[0]}
      </div>
      <div className="collage-view__item">
        <KeepScale className="base-viewer__label base-viewer__label--result">
          {resultFile?.name} - {formatFileSize(resultFile?.size ?? 0)}
        </KeepScale>
        {children[1]}
      </div>
    </div>
  );
}
