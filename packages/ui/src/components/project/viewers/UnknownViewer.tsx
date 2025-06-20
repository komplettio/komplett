import type { FileBaseModel } from '@komplett/core';

import type { ViewerProps } from './BaseViewer';

export type UnknownViewerProps = ViewerProps;

function UnknownViewInput({ originalFile }: { originalFile: FileBaseModel }) {
  return <pre>{JSON.stringify(originalFile, null, 4)}</pre>;
}

export default function UnknownViewer({ originalFile }: UnknownViewerProps) {
  if (!originalFile) {
    return <div className="base-viewer__loading">Loading...</div>;
  }

  return (
    <div className="audio-viewer">
      <UnknownViewInput originalFile={originalFile} />
    </div>
  );
}
