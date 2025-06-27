import type { FileBaseModel } from '@komplett/core';

import type { ViewerProps } from './base/BaseViewer';

export type TextViewerProps = ViewerProps;

function TextViewInput({ originalFile }: { originalFile: FileBaseModel }) {
  return <pre>{JSON.stringify(originalFile, null, 4)}</pre>;
}

export default function TextViewer({ originalFile }: TextViewerProps) {
  if (!originalFile) {
    return <div className="base-viewer__loading">Loading...</div>;
  }

  return (
    <div className="audio-viewer">
      <TextViewInput originalFile={originalFile} />
    </div>
  );
}
