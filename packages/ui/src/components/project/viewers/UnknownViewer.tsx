import { FileBaseModel } from '@komplett/core';

import { BaseViewerProps } from './BaseViewer';

export type UnknownViewerProps = BaseViewerProps;

function SimpleUnknownView({ originalFile }: { originalFile: FileBaseModel }) {
  return <pre>{JSON.stringify(originalFile, null, 4)}</pre>;
}

export default function unknownViewer({ originalFile }: UnknownViewerProps) {
  return (
    <div className="audio-viewer">
      <SimpleUnknownView originalFile={originalFile} />
    </div>
  );
}
