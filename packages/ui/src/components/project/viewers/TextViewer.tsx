import { FileBaseModel } from '@komplett/core';

import { BaseViewerProps } from './BaseViewer';

export type TextViewerProps = BaseViewerProps;

function SimpleTextView({ originalFile }: { originalFile: FileBaseModel }) {
  return <pre>{JSON.stringify(originalFile, null, 4)}</pre>;
}

export default function TextViewer({ originalFile }: TextViewerProps) {
  return (
    <div className="audio-viewer">
      <SimpleTextView originalFile={originalFile} />
    </div>
  );
}
