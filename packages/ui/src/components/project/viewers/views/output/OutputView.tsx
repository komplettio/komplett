import { KeepScale } from 'react-zoom-pan-pinch';

import type { FileBaseModel } from '@komplett/core';

import { formatFileSize } from '#utils/formatters';

export interface OutputViewProps {
  file: FileBaseModel | undefined;
  children?: React.ReactNode;
}

export default function OutputView({ file, children }: OutputViewProps) {
  if (!file) {
    return <div className="base-viewer__loading">Loading...</div>;
  }
  return (
    <div className="output-view">
      <KeepScale className="base-viewer__label base-viewer__label--result">
        {file.name} - {formatFileSize(file.size)}
      </KeepScale>
      {children}
    </div>
  );
}
