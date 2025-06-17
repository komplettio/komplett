import type { FileBaseModel } from '@komplett/core';

import type { BaseViewerProps } from './BaseViewer';

export type DocumentViewerProps = BaseViewerProps;

function SimpleDocumentView({ originalFile }: { originalFile: FileBaseModel }) {
  return <pre>{JSON.stringify(originalFile, null, 4)}</pre>;
}

export default function DocumentViewer({ originalFile }: DocumentViewerProps) {
  return (
    <div className="audio-viewer">
      <SimpleDocumentView originalFile={originalFile} />
    </div>
  );
}
