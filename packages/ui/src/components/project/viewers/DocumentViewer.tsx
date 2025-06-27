import type { FileBaseModel } from '@komplett/core';

import type { ViewerProps } from './base/BaseViewer';

export type DocumentViewerProps = ViewerProps;

function DocumentViewInput({ originalFile }: { originalFile: FileBaseModel }) {
  return <pre>{JSON.stringify(originalFile, null, 4)}</pre>;
}

export default function DocumentViewer({ originalFile }: DocumentViewerProps) {
  if (!originalFile) {
    return <div className="base-viewer__loading">Loading...</div>;
  }

  return (
    <div className="audio-viewer">
      <DocumentViewInput originalFile={originalFile} />
    </div>
  );
}
