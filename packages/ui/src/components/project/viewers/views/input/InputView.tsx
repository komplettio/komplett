import { KeepScale } from 'react-zoom-pan-pinch';

import type { FileBaseModel } from '@komplett/core';

import { formatFileSize } from '#utils/formatters';

export interface InputViewProps {
  file: FileBaseModel;
  children?: React.ReactNode;
}

export default function InputView({ file, children }: InputViewProps) {
  return (
    <div className="input-view">
      <KeepScale className="base-viewer__label base-viewer__label--input">
        {file.name} - {formatFileSize(file.size)}
      </KeepScale>
      {children}
    </div>
  );
}
